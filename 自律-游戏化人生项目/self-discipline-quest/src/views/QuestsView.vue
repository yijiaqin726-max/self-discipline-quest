<script setup>
import { ref, computed } from 'vue'
import { useQuestStore } from '../stores/questStore'
import { useSkillStore } from '../stores/skillStore'

const questStore = useQuestStore()
const skillStore = useSkillStore()

// ── 视图切换 ──────────────────────────────────────────────
const viewMode = ref('list') // 'list' | 'grouped'

// ── 技能名查找 ────────────────────────────────────────────
function skillName(skillId) {
  const s = skillStore.skills.find(s => s.id === skillId)
  return s ? `${s.icon} ${s.name}` : '—'
}

// ── 新增任务表单 ──────────────────────────────────────────
const addVisible = ref(false)
const formName    = ref('')
const formXP      = ref(3)
const formSkillId = ref(null)
const formNewSkill = ref('')
const formError   = ref('')

function openAdd() {
  formName.value = ''
  formXP.value = 3
  formSkillId.value = skillStore.skills[0]?.id ?? null
  formNewSkill.value = ''
  formError.value = ''
  addVisible.value = true
}

function confirmAdd() {
  const name = formName.value.trim()
  if (!name) { formError.value = '请输入任务名称'; return }

  let skillId = formSkillId.value

  // 如果选的是"新技能"
  const newName = formNewSkill.value.trim()
  if (skillId === '__new__') {
    if (!newName) { formError.value = '请输入新技能名称'; return }
    if (!skillStore.skills.some(s => s.name === newName)) {
      skillStore.addSkill(newName, '⭐')
    }
    const created = skillStore.skills.find(s => s.name === newName)
    skillId = created?.id ?? null
  }

  questStore.addQuest(name, formXP.value, skillId)
  addVisible.value = false
}

// ── 编辑任务 ──────────────────────────────────────────────
const editTarget = ref(null)
const editName   = ref('')
const editXP     = ref(3)
const editSkillId = ref(null)

function openEdit(quest) {
  editTarget.value = quest
  editName.value   = quest.name
  editXP.value     = quest.xp
  editSkillId.value = quest.skillId
}

function confirmEdit() {
  const name = editName.value.trim()
  if (!name || !editTarget.value) return
  questStore.updateQuest(editTarget.value.id, {
    name,
    xp: editXP.value,
    skillId: editSkillId.value
  })
  editTarget.value = null
}

// ── 删除任务 ──────────────────────────────────────────────
const deleteTarget = ref(null)

function confirmDelete() {
  if (!deleteTarget.value) return
  questStore.removeQuest(deleteTarget.value.id)
  deleteTarget.value = null
}

// ── 完成任务 (+1) ─────────────────────────────────────────
const milestonePopup = ref(null) // { skillId, milestone }
const rewardInput    = ref('')
const xpFloats       = ref([])
let xpFloatId = 0

function completeQuest(quest, event) {
  const milestone = questStore.completeQuest(quest.id)

  // XP 浮动动画
  spawnXpFloat(quest.xp, event)

  // 里程碑触发
  if (milestone) {
    rewardInput.value = skillStore.getReward(milestone.skillId, milestone.milestone)
    milestonePopup.value = milestone
  }
}

function spawnXpFloat(xp, event) {
  const id = ++xpFloatId
  const rect = event?.currentTarget?.getBoundingClientRect()
  xpFloats.value.push({
    id,
    text: `+${xp} XP ⚡`,
    x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
    y: rect ? rect.top : 200
  })
  setTimeout(() => {
    xpFloats.value = xpFloats.value.filter(f => f.id !== id)
  }, 1200)
}

function saveMilestoneReward() {
  if (!milestonePopup.value) return
  const text = rewardInput.value.trim()
  if (text) {
    skillStore.setReward(milestonePopup.value.skillId, milestonePopup.value.milestone, text)
  }
  milestonePopup.value = null
}

// ── 分组视图 ──────────────────────────────────────────────
const groupedQuests = computed(() => {
  const groups = {}
  for (const q of questStore.quests) {
    const key = q.skillId ?? 'none'
    if (!groups[key]) groups[key] = []
    groups[key].push(q)
  }
  return Object.entries(groups).map(([skillId, quests]) => ({
    skillId: skillId === 'none' ? null : Number(skillId),
    label: skillId === 'none' ? '无关联技能' : skillName(Number(skillId)),
    quests
  }))
})
</script>

<template>
  <div class="quests-page">

    <!-- ── 顶部 ── -->
    <div class="page-header">
      <h1 class="page-title">📋 任务看板</h1>
      <div class="header-actions">
        <div class="view-toggle">
          <button
            class="toggle-btn"
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >列表</button>
          <button
            class="toggle-btn"
            :class="{ active: viewMode === 'grouped' }"
            @click="viewMode = 'grouped'"
          >按技能</button>
        </div>
        <button class="btn btn-primary btn-sm" @click="openAdd">+ 新增任务</button>
      </div>
    </div>

    <!-- ── 空状态 ── -->
    <div v-if="questStore.quests.length === 0" class="empty-state card">
      <div class="empty-icon">📋</div>
      <h3>还没有任务</h3>
      <p>添加任务，每次完成都会为技能积累经验值</p>
      <button class="btn btn-primary" @click="openAdd">创建第一个任务</button>
    </div>

    <!-- ── 列表视图 ── -->
    <div v-else-if="viewMode === 'list'" class="card table-card">
      <table class="quest-table">
        <thead>
          <tr>
            <th>任务名称</th>
            <th class="col-xp">经验值</th>
            <th class="col-skill">关联技能</th>
            <th class="col-count">完成次数</th>
            <th class="col-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="quest in questStore.quests" :key="quest.id" class="quest-row">
            <td class="quest-name">{{ quest.name }}</td>
            <td class="col-xp">
              <span class="xp-badge">{{ quest.xp }} XP</span>
            </td>
            <td class="col-skill skill-cell">{{ skillName(quest.skillId) }}</td>
            <td class="col-count">
              <span class="count-num">{{ quest.count }}</span>
              <span class="count-label">次</span>
            </td>
            <td class="col-actions">
              <button
                class="btn btn-complete btn-sm"
                @click="(e) => completeQuest(quest, e)"
                title="记录完成一次"
              >+1 完成</button>
              <button class="icon-btn" title="编辑" @click="openEdit(quest)">✏️</button>
              <button class="icon-btn danger" title="删除" @click="deleteTarget = quest">✕</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── 分组视图 ── -->
    <div v-else class="grouped-view">
      <div v-for="group in groupedQuests" :key="group.skillId ?? 'none'" class="group-section">
        <div class="group-label">{{ group.label }}</div>
        <div class="card table-card">
          <table class="quest-table">
            <thead>
              <tr>
                <th>任务名称</th>
                <th class="col-xp">经验值</th>
                <th class="col-count">完成次数</th>
                <th class="col-actions">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="quest in group.quests" :key="quest.id" class="quest-row">
                <td class="quest-name">{{ quest.name }}</td>
                <td class="col-xp"><span class="xp-badge">{{ quest.xp }} XP</span></td>
                <td class="col-count">
                  <span class="count-num">{{ quest.count }}</span>
                  <span class="count-label">次</span>
                </td>
                <td class="col-actions">
                  <button
                    class="btn btn-complete btn-sm"
                    @click="(e) => completeQuest(quest, e)"
                  >+1 完成</button>
                  <button class="icon-btn" @click="openEdit(quest)">✏️</button>
                  <button class="icon-btn danger" @click="deleteTarget = quest">✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── 新增任务弹窗 ── -->
    <Transition name="modal">
      <div v-if="addVisible" class="modal-overlay" @click.self="addVisible = false">
        <div class="modal-box">
          <h3 class="modal-title">新增任务</h3>

          <div class="form-group">
            <label class="form-label">任务名称</label>
            <input
              v-model="formName"
              class="form-input"
              placeholder="例如：学习 Vue 1 小时"
              maxlength="40"
              autofocus
              @keydown.enter="confirmAdd"
            />
          </div>

          <div class="form-row">
            <div class="form-group flex1">
              <label class="form-label">经验值</label>
              <select v-model.number="formXP" class="form-input">
                <option :value="3">3 XP</option>
                <option :value="4">4 XP</option>
                <option :value="5">5 XP</option>
              </select>
            </div>
            <div class="form-group flex2">
              <label class="form-label">关联技能</label>
              <select v-model="formSkillId" class="form-input">
                <option :value="null">无关联</option>
                <option v-for="s in skillStore.skills" :key="s.id" :value="s.id">
                  {{ s.icon }} {{ s.name }}
                </option>
                <option value="__new__">➕ 创建新技能...</option>
              </select>
            </div>
          </div>

          <div v-if="formSkillId === '__new__'" class="form-group">
            <label class="form-label">新技能名称</label>
            <input
              v-model="formNewSkill"
              class="form-input"
              placeholder="例如：编程"
              maxlength="20"
            />
          </div>

          <span v-if="formError" class="form-error">{{ formError }}</span>

          <div class="modal-actions">
            <button class="btn btn-ghost" @click="addVisible = false">取消</button>
            <button class="btn btn-primary" @click="confirmAdd">创建</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 编辑任务弹窗 ── -->
    <Transition name="modal">
      <div v-if="editTarget" class="modal-overlay" @click.self="editTarget = null">
        <div class="modal-box">
          <h3 class="modal-title">编辑任务</h3>

          <div class="form-group">
            <label class="form-label">任务名称</label>
            <input
              v-model="editName"
              class="form-input"
              maxlength="40"
              @keydown.enter="confirmEdit"
              autofocus
            />
          </div>

          <div class="form-row">
            <div class="form-group flex1">
              <label class="form-label">经验值</label>
              <select v-model.number="editXP" class="form-input">
                <option :value="3">3 XP</option>
                <option :value="4">4 XP</option>
                <option :value="5">5 XP</option>
              </select>
            </div>
            <div class="form-group flex2">
              <label class="form-label">关联技能</label>
              <select v-model="editSkillId" class="form-input">
                <option :value="null">无关联</option>
                <option v-for="s in skillStore.skills" :key="s.id" :value="s.id">
                  {{ s.icon }} {{ s.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn btn-ghost" @click="editTarget = null">取消</button>
            <button class="btn btn-primary" @click="confirmEdit">保存</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 删除确认弹窗 ── -->
    <Transition name="modal">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal-box">
          <div class="modal-icon">🗑️</div>
          <h3 class="modal-title">删除「{{ deleteTarget.name }}」？</h3>
          <p class="modal-desc">任务记录将被永久删除，已完成的 XP 不受影响。</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="deleteTarget = null">取消</button>
            <button class="btn btn-danger" @click="confirmDelete">确认删除</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 里程碑奖励弹窗 ── -->
    <Transition name="modal">
      <div v-if="milestonePopup" class="modal-overlay">
        <div class="modal-box milestone-box">
          <div class="milestone-firework">🎉</div>
          <h3 class="modal-title milestone-title">
            里程碑解锁！
          </h3>
          <p class="milestone-sub">
            「{{ skillStore.getSkill(milestonePopup.skillId)?.name }}」达到
            <span class="ms-num-big">{{ milestonePopup.milestone }}</span> XP
          </p>
          <p class="modal-desc">设置一个奖励犒劳自己吧 🎁</p>
          <input
            v-model="rewardInput"
            class="form-input"
            placeholder="例如：买一杯奶茶 🧋"
            maxlength="40"
            @keydown.enter="saveMilestoneReward"
            autofocus
          />
          <div class="modal-actions" style="margin-top:16px">
            <button class="btn btn-ghost" @click="milestonePopup = null">跳过</button>
            <button class="btn btn-primary" @click="saveMilestoneReward">保存奖励 🎁</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── XP 浮动层 ── -->
    <div class="float-layer" aria-hidden="true">
      <span
        v-for="f in xpFloats"
        :key="f.id"
        class="xp-float"
        :style="{ left: f.x + 'px', top: f.y + 'px' }"
      >{{ f.text }}</span>
    </div>

  </div>
</template>

<style scoped>
.quests-page {
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
  flex-wrap: wrap;
  gap: 12px;
}

.page-title {
  font-family: var(--font-pixel);
  font-size: 0.72rem;
  color: var(--color-gold);
  letter-spacing: 0.1em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ── 视图切换 ── */
.view-toggle {
  display: flex;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}
.toggle-btn {
  padding: 5px 14px;
  background: none;
  border: none;
  color: var(--color-text-dim);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}
.toggle-btn.active {
  background: rgba(245,166,35,0.15);
  color: var(--color-gold);
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
.empty-state h3 { font-size: 1.1rem; }
.empty-state p { font-size: 0.875rem; color: var(--color-text-dim); margin-bottom: 8px; }

/* ── 表格 ── */
.table-card { padding: 0; overflow: hidden; }

.quest-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.quest-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid var(--color-border);
  background: rgba(0,0,0,0.15);
}

.quest-row {
  border-bottom: 1px solid var(--color-border);
  transition: background 0.15s;
}
.quest-row:last-child { border-bottom: none; }
.quest-row:hover { background: rgba(255,255,255,0.02); }

.quest-table td {
  padding: 12px 16px;
  vertical-align: middle;
}

.quest-name {
  font-weight: 500;
  color: var(--color-text);
}

.col-xp { width: 80px; text-align: center; }
.col-skill { width: 140px; }
.col-count { width: 90px; text-align: center; }
.col-actions { width: 160px; }

.xp-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  background: rgba(245,166,35,0.12);
  border: 1px solid rgba(245,166,35,0.3);
  color: var(--color-gold);
  font-size: 0.78rem;
  font-weight: 600;
}

.skill-cell {
  color: var(--color-text-dim);
  font-size: 0.83rem;
}

.count-num {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
}
.count-label {
  font-size: 0.75rem;
  color: var(--color-text-dim);
  margin-left: 2px;
}

.col-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
}

.btn-complete {
  background: rgba(57, 217, 138, 0.12);
  border: 1px solid rgba(57, 217, 138, 0.35);
  color: var(--color-green);
  white-space: nowrap;
  transition: all 0.2s;
}
.btn-complete:hover {
  background: rgba(57, 217, 138, 0.22);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(57,217,138,0.15);
}

.icon-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-dim);
  font-size: 0.75rem;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.icon-btn:hover { color: var(--color-text); border-color: var(--color-text-dim); }
.icon-btn.danger:hover { color: var(--color-red); border-color: var(--color-red); }

/* ── 分组视图 ── */
.grouped-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.group-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.group-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-left: 4px;
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
  max-width: 420px;
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
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.93); }

/* 里程碑弹窗特效 */
.milestone-box {
  text-align: center;
  border-color: rgba(245,166,35,0.3);
  box-shadow: 0 0 40px rgba(245,166,35,0.15), 0 20px 60px rgba(0,0,0,0.5);
}
.milestone-firework {
  font-size: 3rem;
  animation: bounce 0.6s ease infinite alternate;
}
@keyframes bounce {
  from { transform: translateY(0); }
  to   { transform: translateY(-8px); }
}
.milestone-title { color: var(--color-gold); font-family: var(--font-pixel); font-size: 0.7rem; }
.milestone-sub { font-size: 0.9rem; color: var(--color-text-dim); margin-bottom: 12px; }
.ms-num-big { font-size: 1.2rem; font-weight: 700; color: var(--color-gold); }

/* ── 表单 ── */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}
.form-label {
  font-size: 0.82rem;
  color: var(--color-text-dim);
  font-weight: 500;
}
.form-input { width: 100%; }
.form-error { font-size: 0.78rem; color: var(--color-red); margin-top: -10px; }

.form-row {
  display: flex;
  gap: 12px;
}
.flex1 { flex: 1; }
.flex2 { flex: 2; }

/* ── XP 浮动 ── */
.float-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}

/* ── 响应式 ── */
@media (max-width: 700px) {
  .quests-page { padding: 16px; }
  .col-skill { display: none; }
  .col-actions { gap: 4px; }
  .page-header { flex-direction: column; align-items: flex-start; }
}
</style>
