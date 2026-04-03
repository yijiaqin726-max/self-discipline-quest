<script setup>
import { ref, computed } from 'vue'
import { useSkillStore } from '../stores/skillStore'
import { useQuestStore } from '../stores/questStore'

const skillStore = useSkillStore()
const questStore = useQuestStore()

const PRESET_ICONS = ['⭐','💻','📚','🏃','🎨','🎵','🧠','💪','🌱','🔬','🗣️','🍳']

// ── 添加技能 ──────────────────────────────────────────────
const addVisible   = ref(false)
const newSkillName = ref('')
const newSkillIcon = ref('⭐')
const addError     = ref('')

function openAdd() { newSkillName.value = ''; newSkillIcon.value = '⭐'; addError.value = ''; addVisible.value = true }
function confirmAdd() {
  const name = newSkillName.value.trim()
  if (!name) { addError.value = '请输入技能名称'; return }
  if (skillStore.skills.some(s => s.name === name)) { addError.value = '技能名称已存在'; return }
  skillStore.addSkill(name, newSkillIcon.value)
  addVisible.value = false
}

// ── 删除技能 ──────────────────────────────────────────────
const deleteTarget    = ref(null)
const deleteHasLinked = ref(false)
function openDelete(skill) { deleteTarget.value = skill; deleteHasLinked.value = questStore.quests.some(q => q.skillId === skill.id) }
function confirmDelete() { skillStore.removeSkill(deleteTarget.value.id); deleteTarget.value = null }

// ── 奖励设置 ──────────────────────────────────────────────
const rewardTarget = ref(null)
const rewardInput  = ref('')
function openReward(skillId, milestone) { rewardTarget.value = { skillId, milestone }; rewardInput.value = skillStore.getReward(skillId, milestone) }
function saveReward() { if (!rewardTarget.value) return; skillStore.setReward(rewardTarget.value.skillId, rewardTarget.value.milestone, rewardInput.value.trim()); rewardTarget.value = null }

// ── 展开详情 ──────────────────────────────────────────────
const expandedId = ref(null)
function toggleExpand(id) { expandedId.value = expandedId.value === id ? null : id }

// ── 进度计算 ──────────────────────────────────────────────
function progressPct(skill) {
  const next = skillStore.getNextMilestone(skill.xp)
  if (!next) return 100
  const idx = skillStore.MILESTONES.indexOf(next)
  const prev = idx > 0 ? skillStore.MILESTONES[idx - 1] : 0
  return Math.min(100, Math.round(((skill.xp - prev) / (next - prev)) * 100))
}
function milestoneLabel(skill) {
  const next = skillStore.getNextMilestone(skill.xp)
  if (!next) return '已达最高里程碑 🏆'
  return `距里程碑 ${next} 还差 ${next - skill.xp} XP`
}
</script>

<template>
  <div class="skills-page card">
    <div class="page-header">
      <h3 class="card-title">技能熟练度</h3>
      <button class="btn btn-primary btn-sm" @click="openAdd">＋ 添加技能</button>
    </div>

      <div v-if="skillStore.skills.length === 0" class="empty-state card">
        <div class="empty-icon">🌱</div>
        <h3>还没有技能</h3>
        <p>点击「添加技能」开始你的成长旅程</p>
        <button class="btn btn-primary" @click="openAdd">添加第一个技能</button>
      </div>

      <div v-else class="skills-grid">
        <div v-for="skill in skillStore.skills" :key="skill.id" class="skill-card card">
          <!-- 卡片头部 -->
          <div class="skill-card-header">
            <div class="skill-icon-name">
              <span class="skill-icon">{{ skill.icon }}</span>
              <span class="skill-name">{{ skill.name }}</span>
            </div>
            <div class="skill-btns">
              <button class="icon-btn" @click="toggleExpand(skill.id)">{{ expandedId === skill.id ? '▲' : '▼' }}</button>
              <button class="icon-btn danger" @click="openDelete(skill)">✕</button>
            </div>
          </div>

          <!-- XP & 进度 -->
          <div class="skill-xp-row">
            <span class="xp-big">{{ skill.xp }} XP</span>
            <span class="ms-hint">{{ milestoneLabel(skill) }}</span>
          </div>
          <div class="progress-bar skill-progress">
            <div class="progress-fill" :style="{ width: progressPct(skill) + '%' }"></div>
          </div>

          <!-- 已解锁里程碑 -->
          <div v-if="skill.unlockedMilestones.length > 0" class="ms-badges">
            <span
              v-for="ms in skill.unlockedMilestones"
              :key="ms"
              class="ms-badge"
              :class="{ 'has-reward': skillStore.getReward(skill.id, ms) }"
              @click="openReward(skill.id, ms)"
            >
              🏆 {{ ms }}
              <span v-if="skillStore.getReward(skill.id, ms)"> 🎁</span>
            </span>
          </div>

          <!-- 展开详情 -->
          <Transition name="expand">
            <div v-if="expandedId === skill.id" class="skill-detail">
              <div class="detail-title">里程碑奖励</div>
              <div v-if="skill.unlockedMilestones.length === 0" class="detail-empty">
                熟练度达 {{ skillStore.MILESTONES[0] }} XP 时解锁第一个里程碑
              </div>
              <ul v-else class="reward-list">
                <li v-for="ms in skillStore.MILESTONES" :key="ms" class="reward-item">
                  <div class="reward-ms" :class="{ unlocked: skill.unlockedMilestones.includes(ms) }">
                    <span>{{ skill.unlockedMilestones.includes(ms) ? '🏆' : '🔒' }}</span>
                    <span class="ms-num">{{ ms }} XP</span>
                  </div>
                  <div class="reward-content">
                    <template v-if="skill.unlockedMilestones.includes(ms)">
                      <span v-if="skillStore.getReward(skill.id, ms)" class="reward-text">🎁 {{ skillStore.getReward(skill.id, ms) }}</span>
                      <button v-else class="btn btn-ghost btn-sm" @click="openReward(skill.id, ms)">设置奖励</button>
                    </template>
                    <span v-else class="locked-text">未解锁</span>
                  </div>
                </li>
              </ul>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- ── 添加技能弹窗 ── -->
    <Transition name="modal">
      <div v-if="addVisible" class="modal-overlay" @click.self="addVisible = false">
        <div class="modal-box">
          <h3 class="modal-title">添加新技能</h3>
          <div class="form-group">
            <label class="form-label">技能名称</label>
            <input v-model="newSkillName" class="form-input" placeholder="例如：编程、英语、健身..." maxlength="20" @keydown.enter="confirmAdd" autofocus />
            <span v-if="addError" class="form-error">{{ addError }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">选择图标</label>
            <div class="icon-picker">
              <button v-for="icon in PRESET_ICONS" :key="icon" class="icon-option" :class="{ active: newSkillIcon === icon }" @click="newSkillIcon = icon">{{ icon }}</button>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="addVisible = false">取消</button>
            <button class="btn btn-primary" @click="confirmAdd">添加</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 删除确认 ── -->
    <Transition name="modal">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal-box">
          <div class="modal-icon">⚠️</div>
          <h3 class="modal-title">删除「{{ deleteTarget.name }}」？</h3>
          <p class="modal-desc">
            技能数据将全部清除。
            <template v-if="deleteHasLinked"><br /><span class="warn-text">⚠️ 有任务关联此技能，删除后关联将失效。</span></template>
          </p>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="deleteTarget = null">取消</button>
            <button class="btn btn-danger" @click="confirmDelete">确认删除</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 奖励设置弹窗 ── -->
    <Transition name="modal">
      <div v-if="rewardTarget" class="modal-overlay" @click.self="rewardTarget = null">
        <div class="modal-box">
          <div class="modal-icon">🎁</div>
          <h3 class="modal-title">里程碑 {{ rewardTarget.milestone }} XP 奖励</h3>
          <p class="modal-desc">达到里程碑！设置奖励犒劳自己 🎉</p>
          <input v-model="rewardInput" class="form-input" placeholder="例如：买一杯奶茶 🧋" maxlength="40" @keydown.enter="saveReward" autofocus />
          <div class="modal-actions" style="margin-top:16px">
            <button class="btn btn-ghost" @click="rewardTarget = null">跳过</button>
            <button class="btn btn-primary" @click="saveReward">保存奖励</button>
          </div>
        </div>
      </div>
    </Transition>
</template>

<style scoped>
.skills-page { display: flex; flex-direction: column; gap: 14px; }
.card-title { font-size: 0.8rem; font-weight: var(--fw-black); color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.06em; }
.page-header { display: flex; align-items: center; justify-content: space-between; }

/* 空状态 */
.empty-state { text-align: center; padding: 60px 40px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.empty-icon { font-size: 3rem; }
.empty-state h3 { font-size: 1.1rem; font-weight: var(--fw-black); }
.empty-state p { font-size: 0.875rem; color: var(--color-text-dim); font-weight: 600; margin-bottom: 8px; }

/* 技能网格 */
.skills-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }

.skill-card {
  display: flex; flex-direction: column; gap: 12px;
  background: #fff;
  transition: transform 0.07s, box-shadow 0.07s;
}
.skill-card:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #000; }

.skill-card-header { display: flex; align-items: center; justify-content: space-between; }
.skill-icon-name { display: flex; align-items: center; gap: 10px; }
.skill-icon { font-size: 1.5rem; }
.skill-name { font-size: 1rem; font-weight: var(--fw-black); color: #000; }
.skill-btns { display: flex; gap: 6px; }

.icon-btn {
  background: #fff; border: 2px solid #000; border-radius: 8px;
  font-size: 0.7rem; width: 28px; height: 28px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 2px 2px 0 #000;
  transition: transform 0.07s, box-shadow 0.07s;
}
.icon-btn:hover { transform: translate(1px,1px); box-shadow: 1px 1px 0 #000; }
.icon-btn:active { transform: translate(2px,2px); box-shadow: none; }
.icon-btn.danger:hover { background: var(--color-pink); }

.skill-xp-row { display: flex; justify-content: space-between; align-items: baseline; }
.xp-big { font-size: 1.2rem; font-weight: var(--fw-black); color: #000; }
.ms-hint { font-size: 0.72rem; font-weight: var(--fw-bold); color: var(--color-text-dim); }

.skill-progress { height: 12px; }

/* 里程碑徽章 */
.ms-badges { display: flex; flex-wrap: wrap; gap: 6px; }
.ms-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 10px;
  border-radius: 20px; border: 2px solid #000;
  font-size: 0.72rem; font-weight: var(--fw-bold);
  background: var(--color-yellow);
  cursor: pointer; box-shadow: 2px 2px 0 #000;
  transition: transform 0.07s, box-shadow 0.07s;
}
.ms-badge:hover { transform: translate(1px,1px); box-shadow: 1px 1px 0 #000; }
.ms-badge.has-reward { background: var(--color-mint); }

/* 展开详情 */
.skill-detail { border-top: 3px solid #000; padding-top: 12px; }
.detail-title { font-size: 0.78rem; font-weight: var(--fw-black); color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; }
.detail-empty { font-size: 0.8rem; color: var(--color-text-dim); font-weight: 600; }
.reward-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.reward-item { display: flex; align-items: center; gap: 12px; }
.reward-ms { display: flex; align-items: center; gap: 6px; min-width: 80px; opacity: 0.45; }
.reward-ms.unlocked { opacity: 1; }
.ms-num { font-size: 0.8rem; font-weight: var(--fw-bold); color: var(--color-text-dim); }
.reward-ms.unlocked .ms-num { color: #000; font-weight: var(--fw-black); }
.reward-content { flex: 1; }
.reward-text { font-size: 0.82rem; font-weight: var(--fw-bold); color: #000; }
.locked-text { font-size: 0.78rem; color: var(--color-text-muted); font-weight: 600; }

.expand-enter-active, .expand-leave-active { transition: all 0.22s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 320px; }

/* 表单 */
.form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.form-label { font-size: 0.82rem; font-weight: var(--fw-bold); color: var(--color-text-dim); }
.form-input { width: 100%; }
.form-error { font-size: 0.78rem; color: #c00; font-weight: 600; }
.icon-picker { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
.icon-option {
  font-size: 1.3rem; background: #fff;
  border: 2px solid transparent; border-radius: 8px;
  cursor: pointer; padding: 6px; text-align: center;
  transition: all 0.1s; box-shadow: none;
}
.icon-option:hover { border-color: #000; }
.icon-option.active { border-color: #000; background: var(--color-yellow); box-shadow: 2px 2px 0 #000; }
.warn-text { color: #c00; font-weight: var(--fw-bold); }

@media (max-width: 600px) {
  .skills-grid { gap: 8px; }
}
</style>
