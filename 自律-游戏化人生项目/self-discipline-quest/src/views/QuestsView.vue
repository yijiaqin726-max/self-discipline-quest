<script setup>
import { ref, computed } from 'vue'
import { useQuestStore } from '../stores/questStore'
import { useSkillStore } from '../stores/skillStore'

const questStore = useQuestStore()
const skillStore = useSkillStore()

const viewMode = ref('list')

function skillName(skillId) {
  const s = skillStore.skills.find(s => s.id === skillId)
  return s ? `${s.icon} ${s.name}` : '—'
}

// ── 新增任务 ──────────────────────────────────────────────
const addVisible  = ref(false)
const formName    = ref('')
const formXP      = ref(3)
const formSkillId = ref(null)
const formNewSkill = ref('')
const formError   = ref('')

function openAdd() {
  formName.value = ''; formXP.value = 3; formError.value = ''
  formSkillId.value = skillStore.skills[0]?.id ?? null
  formNewSkill.value = ''
  addVisible.value = true
}
function confirmAdd() {
  const name = formName.value.trim()
  if (!name) { formError.value = '请输入任务名称'; return }
  let skillId = formSkillId.value
  if (skillId === '__new__') {
    const nn = formNewSkill.value.trim()
    if (!nn) { formError.value = '请输入新技能名称'; return }
    if (!skillStore.skills.some(s => s.name === nn)) skillStore.addSkill(nn, '⭐')
    skillId = skillStore.skills.find(s => s.name === nn)?.id ?? null
  }
  questStore.addQuest(name, formXP.value, skillId)
  addVisible.value = false
}

// ── 编辑 ─────────────────────────────────────────────────
const editTarget  = ref(null)
const editName    = ref('')
const editXP      = ref(3)
const editSkillId = ref(null)

function openEdit(quest) { editTarget.value = quest; editName.value = quest.name; editXP.value = quest.xp; editSkillId.value = quest.skillId }
function confirmEdit() {
  if (!editName.value.trim() || !editTarget.value) return
  questStore.updateQuest(editTarget.value.id, { name: editName.value.trim(), xp: editXP.value, skillId: editSkillId.value })
  editTarget.value = null
}

// ── 删除 ─────────────────────────────────────────────────
const deleteTarget = ref(null)
function confirmDelete() { questStore.removeQuest(deleteTarget.value.id); deleteTarget.value = null }

// ── 完成任务 (+1) ─────────────────────────────────────────
const milestonePopup = ref(null)
const rewardInput    = ref('')
const xpFloats       = ref([])
let xpFloatId = 0

function completeQuest(quest, event) {
  const milestone = questStore.completeQuest(quest.id)
  spawnXpFloat(quest.xp, event)
  if (milestone) { rewardInput.value = skillStore.getReward(milestone.skillId, milestone.milestone); milestonePopup.value = milestone }
}
function spawnXpFloat(xp, event) {
  const id = ++xpFloatId
  const rect = event?.currentTarget?.getBoundingClientRect()
  xpFloats.value.push({ id, text: `+${xp} XP`, x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2, y: rect ? rect.top - 8 : 200 })
  setTimeout(() => { xpFloats.value = xpFloats.value.filter(f => f.id !== id) }, 1200)
}
function saveMilestoneReward() {
  if (!milestonePopup.value) return
  const text = rewardInput.value.trim()
  if (text) skillStore.setReward(milestonePopup.value.skillId, milestonePopup.value.milestone, text)
  milestonePopup.value = null
}

// ── 分组 ─────────────────────────────────────────────────
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
    <div class="section-inner">
      <!-- ── 标题行 ── -->
      <div class="page-header">
        <h2 class="section-title">📋 任务看板</h2>
        <div class="header-right">
          <div class="view-toggle">
            <button class="toggle-btn" :class="{ active: viewMode==='list' }" @click="viewMode='list'">列表</button>
            <button class="toggle-btn" :class="{ active: viewMode==='grouped' }" @click="viewMode='grouped'">按技能</button>
          </div>
          <button class="btn btn-primary btn-sm" @click="openAdd">＋ 新增任务</button>
        </div>
      </div>

      <!-- ── 空状态 ── -->
      <div v-if="questStore.quests.length === 0" class="empty-state card">
        <div class="empty-icon">📋</div>
        <h3>还没有任务</h3>
        <p>添加任务，每次完成都会积累经验值</p>
        <button class="btn btn-primary" @click="openAdd">创建第一个任务</button>
      </div>

      <!-- ── 列表视图 ── -->
      <div v-else-if="viewMode==='list'" class="quest-list">
        <div v-for="quest in questStore.quests" :key="quest.id" class="quest-card card">
          <div class="quest-main">
            <span class="quest-name">{{ quest.name }}</span>
            <span class="xp-chip">{{ quest.xp }} XP</span>
          </div>
          <div class="quest-meta">
            <span class="quest-skill">{{ skillName(quest.skillId) }}</span>
            <span class="quest-count">完成 <strong>{{ quest.count }}</strong> 次</span>
          </div>
          <div class="quest-actions">
            <button class="btn btn-complete btn-sm" @click="(e) => completeQuest(quest, e)">＋1 完成</button>
            <button class="icon-btn" @click="openEdit(quest)">✏️</button>
            <button class="icon-btn danger" @click="deleteTarget = quest">✕</button>
          </div>
        </div>
      </div>

      <!-- ── 分组视图 ── -->
      <div v-else class="grouped-view">
        <div v-for="group in groupedQuests" :key="group.skillId ?? 'none'" class="group-block">
          <div class="group-label">{{ group.label }}</div>
          <div class="quest-list">
            <div v-for="quest in group.quests" :key="quest.id" class="quest-card card">
              <div class="quest-main">
                <span class="quest-name">{{ quest.name }}</span>
                <span class="xp-chip">{{ quest.xp }} XP</span>
              </div>
              <div class="quest-meta">
                <span class="quest-count">完成 <strong>{{ quest.count }}</strong> 次</span>
              </div>
              <div class="quest-actions">
                <button class="btn btn-complete btn-sm" @click="(e) => completeQuest(quest, e)">＋1 完成</button>
                <button class="icon-btn" @click="openEdit(quest)">✏️</button>
                <button class="icon-btn danger" @click="deleteTarget = quest">✕</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── 新增弹窗 ── -->
    <Transition name="modal">
      <div v-if="addVisible" class="modal-overlay" @click.self="addVisible = false">
        <div class="modal-box">
          <h3 class="modal-title">新增任务</h3>
          <div class="form-group">
            <label class="form-label">任务名称</label>
            <input v-model="formName" class="form-input" placeholder="例如：学习 Vue 1 小时" maxlength="40" autofocus @keydown.enter="confirmAdd" />
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
                <option v-for="s in skillStore.skills" :key="s.id" :value="s.id">{{ s.icon }} {{ s.name }}</option>
                <option value="__new__">➕ 创建新技能...</option>
              </select>
            </div>
          </div>
          <div v-if="formSkillId === '__new__'" class="form-group">
            <label class="form-label">新技能名称</label>
            <input v-model="formNewSkill" class="form-input" placeholder="例如：编程" maxlength="20" />
          </div>
          <span v-if="formError" class="form-error">{{ formError }}</span>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="addVisible = false">取消</button>
            <button class="btn btn-primary" @click="confirmAdd">创建</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 编辑弹窗 ── -->
    <Transition name="modal">
      <div v-if="editTarget" class="modal-overlay" @click.self="editTarget = null">
        <div class="modal-box">
          <h3 class="modal-title">编辑任务</h3>
          <div class="form-group">
            <label class="form-label">任务名称</label>
            <input v-model="editName" class="form-input" maxlength="40" @keydown.enter="confirmEdit" autofocus />
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
                <option v-for="s in skillStore.skills" :key="s.id" :value="s.id">{{ s.icon }} {{ s.name }}</option>
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

    <!-- ── 删除确认 ── -->
    <Transition name="modal">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal-box">
          <div class="modal-icon">🗑️</div>
          <h3 class="modal-title">删除「{{ deleteTarget.name }}」？</h3>
          <p class="modal-desc">任务记录将被永久删除。</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="deleteTarget = null">取消</button>
            <button class="btn btn-danger" @click="confirmDelete">确认删除</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 里程碑奖励 ── -->
    <Transition name="modal">
      <div v-if="milestonePopup" class="modal-overlay">
        <div class="modal-box milestone-box">
          <div class="ms-firework">🎉</div>
          <h3 class="modal-title ms-title">里程碑解锁！</h3>
          <p class="ms-sub">「{{ skillStore.getSkill(milestonePopup.skillId)?.name }}」达到 <strong>{{ milestonePopup.milestone }} XP</strong></p>
          <p class="modal-desc">设置一个奖励犒劳自己吧 🎁</p>
          <input v-model="rewardInput" class="form-input" placeholder="例如：买一杯奶茶 🧋" maxlength="40" @keydown.enter="saveMilestoneReward" autofocus />
          <div class="modal-actions" style="margin-top:16px">
            <button class="btn btn-ghost" @click="milestonePopup = null">跳过</button>
            <button class="btn btn-primary" @click="saveMilestoneReward">保存奖励 🎁</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── XP 浮动层 ── -->
    <div class="float-layer" aria-hidden="true">
      <span v-for="f in xpFloats" :key="f.id" class="xp-float" :style="{ left: f.x+'px', top: f.y+'px' }">{{ f.text }}</span>
    </div>
  </div>
</template>

<style scoped>
.quests-page { width: 100%; }
.section-inner { max-width: 900px; display: flex; flex-direction: column; gap: 20px; }

.page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.header-right { display: flex; align-items: center; gap: 12px; }

/* 视图切换 */
.view-toggle {
  display: flex;
  border: 3px solid #000;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 2px 2px 0 #000;
}
.toggle-btn {
  padding: 6px 14px;
  background: #fff;
  border: none;
  font-family: var(--font-body);
  font-weight: var(--fw-bold);
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.1s;
}
.toggle-btn + .toggle-btn { border-left: 3px solid #000; }
.toggle-btn.active { background: #000; color: #fff; }

/* 空状态 */
.empty-state { text-align: center; padding: 60px 40px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.empty-icon { font-size: 3rem; }
.empty-state h3 { font-size: 1.1rem; font-weight: var(--fw-black); }
.empty-state p { font-size: 0.875rem; color: var(--color-text-dim); font-weight: 600; margin-bottom: 8px; }

/* 任务卡片列表 */
.quest-list { display: flex; flex-direction: column; gap: 12px; }
.quest-card {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px 20px;
  background: #fff;
  transition: transform 0.07s, box-shadow 0.07s;
}
.quest-card:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #000; }

.quest-main { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 160px; }
.quest-name { font-weight: var(--fw-bold); font-size: 0.95rem; color: #000; }
.xp-chip {
  padding: 3px 10px;
  background: var(--color-yellow);
  border: 2px solid #000;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: var(--fw-black);
  box-shadow: 2px 2px 0 #000;
  white-space: nowrap;
}
.quest-meta { display: flex; align-items: center; gap: 12px; font-size: 0.82rem; color: var(--color-text-dim); font-weight: 600; }
.quest-count strong { color: #000; font-weight: var(--fw-black); }

.quest-actions { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.btn-complete { background: var(--color-mint); white-space: nowrap; }

.icon-btn {
  background: #fff;
  border: 2px solid #000;
  border-radius: 8px;
  font-size: 0.75rem;
  width: 30px; height: 30px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 2px 2px 0 #000;
  transition: transform 0.07s, box-shadow 0.07s;
}
.icon-btn:hover { transform: translate(1px,1px); box-shadow: 1px 1px 0 #000; }
.icon-btn:active { transform: translate(2px,2px); box-shadow: none; }
.icon-btn.danger:hover { background: var(--color-pink); }

/* 分组视图 */
.grouped-view { display: flex; flex-direction: column; gap: 20px; }
.group-block { display: flex; flex-direction: column; gap: 10px; }
.group-label { font-size: 0.85rem; font-weight: var(--fw-black); color: #000; padding-left: 4px; }

/* 里程碑弹窗 */
.milestone-box { border-color: #000; box-shadow: 8px 8px 0 #000; text-align: center; }
.ms-firework { font-size: 3rem; animation: bounce 0.6s ease infinite alternate; }
@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-8px); } }
.ms-title { font-weight: var(--fw-black); }
.ms-sub { font-size: 0.9rem; color: var(--color-text-dim); margin-bottom: 12px; font-weight: 600; }
.ms-sub strong { color: #000; font-weight: var(--fw-black); }

/* 表单 */
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.form-label { font-size: 0.82rem; font-weight: var(--fw-bold); color: var(--color-text-dim); }
.form-input { width: 100%; }
.form-error { font-size: 0.78rem; color: #c00; font-weight: 600; margin-top: -10px; }
.form-row { display: flex; gap: 12px; }
.flex1 { flex: 1; }
.flex2 { flex: 2; }

/* XP 浮动 */
.float-layer { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }

@media (max-width: 600px) {
  .quest-card { flex-direction: column; align-items: flex-start; }
  .quest-actions { width: 100%; }
}
</style>
