<script setup>
import { ref, computed } from 'vue'
import { useSkillStore } from '../stores/skillStore'
import { useQuestStore } from '../stores/questStore'

const skillStore = useSkillStore()
const questStore = useQuestStore()

const PRESET_ICONS = ['⭐', '💻', '📚', '🏃', '🎨', '🎵', '🧠', '💪', '🌱', '🔬', '🗣️', '🍳']

// ── 添加技能弹窗 ──────────────────────────────────────────
const addVisible = ref(false)
const newSkillName = ref('')
const newSkillIcon = ref('⭐')
const addError = ref('')

function openAdd() {
  newSkillName.value = ''
  newSkillIcon.value = '⭐'
  addError.value = ''
  addVisible.value = true
}

function confirmAdd() {
  const name = newSkillName.value.trim()
  if (!name) { addError.value = '请输入技能名称'; return }
  if (skillStore.skills.some(s => s.name === name)) {
    addError.value = '技能名称已存在'; return
  }
  skillStore.addSkill(name, newSkillIcon.value)
  addVisible.value = false
}

// ── 删除技能 ──────────────────────────────────────────────
const deleteTarget = ref(null)
const deleteHasLinked = ref(false)

function openDelete(skill) {
  deleteTarget.value = skill
  deleteHasLinked.value = questStore.quests.some(q => q.skillId === skill.id)
}

function confirmDelete() {
  if (!deleteTarget.value) return
  skillStore.removeSkill(deleteTarget.value.id)
  deleteTarget.value = null
}

// ── 奖励设置弹窗 ──────────────────────────────────────────
const rewardTarget = ref(null) // { skillId, milestone }
const rewardInput = ref('')

function openReward(skillId, milestone) {
  rewardTarget.value = { skillId, milestone }
  rewardInput.value = skillStore.getReward(skillId, milestone)
}

function saveReward() {
  if (!rewardTarget.value) return
  skillStore.setReward(rewardTarget.value.skillId, rewardTarget.value.milestone, rewardInput.value.trim())
  rewardTarget.value = null
}

// ── 展开详情 ──────────────────────────────────────────────
const expandedId = ref(null)
function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
}

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
  if (!next) return '已达到最高里程碑 🏆'
  return `距里程碑 ${next} 还差 ${next - skill.xp} XP`
}
</script>

<template>
  <div class="skills-page">

    <!-- ── 顶部 ── -->
    <div class="page-header">
      <h1 class="page-title">✨ 技能熟练度</h1>
      <button class="btn btn-primary btn-sm" @click="openAdd">+ 添加技能</button>
    </div>

    <!-- ── 空状态 ── -->
    <div v-if="skillStore.skills.length === 0" class="empty-state card">
      <div class="empty-icon">🌱</div>
      <h3>还没有技能</h3>
      <p>点击「添加技能」开始你的成长旅程</p>
      <button class="btn btn-primary" @click="openAdd">添加第一个技能</button>
    </div>

    <!-- ── 技能卡片网格 ── -->
    <div v-else class="skills-grid">
      <div
        v-for="skill in skillStore.skills"
        :key="skill.id"
        class="skill-card card"
      >
        <!-- 卡片头部 -->
        <div class="skill-card-header">
          <div class="skill-icon-name">
            <span class="skill-icon">{{ skill.icon }}</span>
            <span class="skill-name">{{ skill.name }}</span>
          </div>
          <div class="skill-actions">
            <button class="icon-btn" title="展开详情" @click="toggleExpand(skill.id)">
              {{ expandedId === skill.id ? '▲' : '▼' }}
            </button>
            <button class="icon-btn danger" title="删除技能" @click="openDelete(skill)">✕</button>
          </div>
        </div>

        <!-- XP & 进度条 -->
        <div class="skill-xp-row">
          <span class="xp-num">{{ skill.xp }} XP</span>
          <span class="milestone-hint">{{ milestoneLabel(skill) }}</span>
        </div>
        <div class="progress-bar skill-progress">
          <div class="progress-fill" :style="{ width: progressPct(skill) + '%' }"></div>
        </div>

        <!-- 已解锁里程碑徽章 -->
        <div v-if="skill.unlockedMilestones.length > 0" class="milestone-badges">
          <span
            v-for="ms in skill.unlockedMilestones"
            :key="ms"
            class="ms-badge"
            :class="{ 'has-reward': skillStore.getReward(skill.id, ms) }"
            @click="openReward(skill.id, ms)"
            title="点击设置/编辑奖励"
          >
            🏆 {{ ms }}
            <span v-if="skillStore.getReward(skill.id, ms)" class="reward-dot">🎁</span>
          </span>
        </div>

        <!-- 展开详情：历史奖励 -->
        <Transition name="expand">
          <div v-if="expandedId === skill.id" class="skill-detail">
            <div class="detail-title">里程碑奖励</div>
            <div v-if="skill.unlockedMilestones.length === 0" class="detail-empty">
              完成任务提升熟练度，达到 {{ skillStore.MILESTONES[0] }} XP 解锁第一个里程碑
            </div>
            <ul v-else class="reward-list">
              <li v-for="ms in skillStore.MILESTONES" :key="ms" class="reward-item">
                <div class="reward-milestone" :class="{ unlocked: skill.unlockedMilestones.includes(ms) }">
                  <span class="ms-icon">{{ skill.unlockedMilestones.includes(ms) ? '🏆' : '🔒' }}</span>
                  <span class="ms-num">{{ ms }} XP</span>
                </div>
                <div class="reward-content">
                  <template v-if="skill.unlockedMilestones.includes(ms)">
                    <span v-if="skillStore.getReward(skill.id, ms)" class="reward-text">
                      🎁 {{ skillStore.getReward(skill.id, ms) }}
                    </span>
                    <button v-else class="btn btn-ghost btn-sm" @click="openReward(skill.id, ms)">
                      设置奖励
                    </button>
                  </template>
                  <span v-else class="locked-text">未解锁</span>
                </div>
              </li>
            </ul>
          </div>
        </Transition>
      </div>
    </div>

    <!-- ── 添加技能弹窗 ── -->
    <Transition name="modal">
      <div v-if="addVisible" class="modal-overlay" @click.self="addVisible = false">
        <div class="modal-box">
          <h3 class="modal-title">添加新技能</h3>

          <div class="form-group">
            <label class="form-label">技能名称</label>
            <input
              v-model="newSkillName"
              class="form-input"
              placeholder="例如：编程、英语、健身..."
              maxlength="20"
              @keydown.enter="confirmAdd"
              autofocus
            />
            <span v-if="addError" class="form-error">{{ addError }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">选择图标</label>
            <div class="icon-picker">
              <button
                v-for="icon in PRESET_ICONS"
                :key="icon"
                class="icon-option"
                :class="{ active: newSkillIcon === icon }"
                @click="newSkillIcon = icon"
              >{{ icon }}</button>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn btn-ghost" @click="addVisible = false">取消</button>
            <button class="btn btn-primary" @click="confirmAdd">添加</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 删除确认弹窗 ── -->
    <Transition name="modal">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal-box">
          <div class="modal-icon">⚠️</div>
          <h3 class="modal-title">删除「{{ deleteTarget.name }}」？</h3>
          <p class="modal-desc">
            技能熟练度数据将全部清除。
            <template v-if="deleteHasLinked">
              <br /><span class="warn-text">⚠️ 有任务关联了此技能，删除后关联将失效。</span>
            </template>
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
          <h3 class="modal-title">
            里程碑 {{ rewardTarget.milestone }} XP 奖励
          </h3>
          <p class="modal-desc">你解锁了一个里程碑！设置一个奖励犒劳自己吧 🎉</p>
          <input
            v-model="rewardInput"
            class="form-input"
            placeholder="例如：买一杯奶茶 🧋"
            maxlength="40"
            @keydown.enter="saveReward"
            autofocus
          />
          <div class="modal-actions" style="margin-top: 16px">
            <button class="btn btn-ghost" @click="rewardTarget = null">跳过</button>
            <button class="btn btn-primary" @click="saveReward">保存奖励</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.skills-page {
  padding: 32px;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-family: var(--font-pixel);
  font-size: 0.72rem;
  color: var(--color-gold);
  letter-spacing: 0.1em;
}

/* ── 空状态 ── */
.empty-state {
  text-align: center;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.empty-icon { font-size: 3rem; }
.empty-state h3 { font-size: 1.1rem; color: var(--color-text); }
.empty-state p { font-size: 0.875rem; color: var(--color-text-dim); margin-bottom: 8px; }

/* ── 网格 ── */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* ── 技能卡片 ── */
.skill-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.skill-card:hover {
  border-color: rgba(245,166,35,0.2);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.skill-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.skill-icon-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.skill-icon { font-size: 1.4rem; }
.skill-name { font-size: 0.95rem; font-weight: 600; color: var(--color-text); }

.skill-actions {
  display: flex;
  gap: 6px;
}

.icon-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-dim);
  font-size: 0.7rem;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.icon-btn:hover { color: var(--color-text); border-color: var(--color-text-dim); }
.icon-btn.danger:hover { color: var(--color-red); border-color: var(--color-red); }

.skill-xp-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.xp-num {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-gold);
}

.milestone-hint {
  font-size: 0.72rem;
  color: var(--color-text-dim);
}

.skill-progress {
  height: 10px;
}

/* ── 里程碑徽章 ── */
.milestone-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ms-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  background: rgba(245, 166, 35, 0.1);
  border: 1px solid rgba(245, 166, 35, 0.3);
  color: var(--color-gold);
  cursor: pointer;
  transition: background 0.2s;
}
.ms-badge:hover { background: rgba(245, 166, 35, 0.2); }
.ms-badge.has-reward {
  background: rgba(57, 217, 138, 0.1);
  border-color: rgba(57, 217, 138, 0.3);
  color: var(--color-green);
}

.reward-dot { font-size: 0.8rem; }

/* ── 展开详情 ── */
.skill-detail {
  border-top: 1px solid var(--color-border);
  padding-top: 12px;
}

.detail-title {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}

.detail-empty {
  font-size: 0.8rem;
  color: var(--color-text-dim);
}

.reward-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reward-milestone {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 90px;
  opacity: 0.5;
}
.reward-milestone.unlocked { opacity: 1; }

.ms-icon { font-size: 0.9rem; }
.ms-num { font-size: 0.8rem; color: var(--color-text-dim); }
.reward-milestone.unlocked .ms-num { color: var(--color-gold); font-weight: 600; }

.reward-content { flex: 1; }
.reward-text { font-size: 0.82rem; color: var(--color-green); }
.locked-text { font-size: 0.78rem; color: var(--color-text-muted); }

/* 展开动画 */
.expand-enter-active, .expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to, .expand-leave-from {
  opacity: 1;
  max-height: 300px;
}

/* ── 弹窗 ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}
.modal-box {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px;
  max-width: 400px;
  width: 92%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
.modal-icon { font-size: 2.5rem; text-align: center; margin-bottom: 12px; }
.modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
  text-align: center;
}
.modal-desc {
  font-size: 0.85rem;
  color: var(--color-text-dim);
  margin-bottom: 20px;
  text-align: center;
  line-height: 1.6;
}
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

/* 弹窗过渡 */
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.93); }

/* ── 表单 ── */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.form-label {
  font-size: 0.82rem;
  color: var(--color-text-dim);
  font-weight: 500;
}
.form-input { width: 100%; }
.form-error { font-size: 0.78rem; color: var(--color-red); }

.icon-picker {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}
.icon-option {
  font-size: 1.3rem;
  background: var(--color-bg);
  border: 2px solid transparent;
  border-radius: var(--radius);
  cursor: pointer;
  padding: 6px;
  transition: all 0.15s;
  line-height: 1;
  text-align: center;
}
.icon-option:hover { border-color: var(--color-gold-dim); }
.icon-option.active { border-color: var(--color-gold); background: rgba(245,166,35,0.1); }

.warn-text { color: var(--color-red); }

/* ── 响应式 ── */
@media (max-width: 600px) {
  .skills-page { padding: 16px; gap: 16px; }
  .skills-grid { grid-template-columns: 1fr; }
}
</style>
