<script setup>
import { ref, computed } from 'vue'
import { Play, Pencil, X, Target } from 'lucide-vue-next'
import { useQuestStore } from '../stores/questStore'
import { useSkillStore } from '../stores/skillStore'

const questStore = useQuestStore()
const skillStore = useSkillStore()

const viewMode = ref('list')

function skillName(skillId) {
  const s = skillStore.skills.find(s => s.id === skillId)
  return s ? `${s.icon} ${s.name}` : '—'
}

// ── 状态配置 ──────────────────────────────────────────────────────────────
const STATUS_META = {
  pending: { label: '待开始', cls: 'status-pending' },
  active:  { label: '进行中', cls: 'status-active'  },
  done:    { label: '已完成', cls: 'status-done'    },
}

// ── 新增任务 ──────────────────────────────────────────────────────────────
const addVisible   = ref(false)
const formName     = ref('')
const formXP       = ref(10)
const formSkillId  = ref(null)
const formStatus   = ref('pending')
const formPomodoros = ref(1)
const formNewSkill = ref('')
const formError    = ref('')

function openAdd() {
  formName.value = ''; formXP.value = 10; formError.value = ''
  formSkillId.value  = skillStore.skills[0]?.id ?? null
  formStatus.value   = 'pending'
  formPomodoros.value = 1
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
  questStore.addQuest(name, formXP.value, skillId, {
    status:             formStatus.value,
    estimatedPomodoros: formPomodoros.value,
  })
  addVisible.value = false
}

// ── 编辑 ──────────────────────────────────────────────────────────────────
const editTarget   = ref(null)
const editName     = ref('')
const editXP       = ref(10)
const editSkillId  = ref(null)
const editStatus   = ref('pending')
const editPomodoros = ref(1)

function openEdit(quest) {
  editTarget.value    = quest
  editName.value      = quest.name
  editXP.value        = quest.xp
  editSkillId.value   = quest.skillId
  editStatus.value    = quest.status ?? 'pending'
  editPomodoros.value = quest.estimatedPomodoros ?? 1
}
function confirmEdit() {
  if (!editName.value.trim() || !editTarget.value) return
  questStore.updateQuest(editTarget.value.id, {
    name:               editName.value.trim(),
    xp:                 editXP.value,
    skillId:            editSkillId.value,
    status:             editStatus.value,
    estimatedPomodoros: editPomodoros.value,
  })
  editTarget.value = null
}

// ── 删除 ──────────────────────────────────────────────────────────────────
const deleteTarget = ref(null)
function confirmDelete() { questStore.removeQuest(deleteTarget.value.id); deleteTarget.value = null }

// ── 完成任务 ──────────────────────────────────────────────────────────────
const milestonePopup = ref(null)
const rewardInput    = ref('')
const xpFloats       = ref([])
let xpFloatId = 0

function completeQuest(quest, event) {
  const milestone = questStore.completeQuest(quest.id)
  spawnXpFloat(quest.xp, event)
  if (milestone) {
    rewardInput.value  = skillStore.getReward(milestone.skillId, milestone.milestone)
    milestonePopup.value = milestone
  }
}
function spawnXpFloat(xp, event) {
  const id   = ++xpFloatId
  const rect = event?.currentTarget?.getBoundingClientRect()
  xpFloats.value.push({
    id,
    text: `+${xp} XP`,
    x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
    y: rect ? rect.top - 8 : 200,
  })
  setTimeout(() => { xpFloats.value = xpFloats.value.filter(f => f.id !== id) }, 1200)
}
function saveMilestoneReward() {
  if (!milestonePopup.value) return
  const text = rewardInput.value.trim()
  if (text) skillStore.setReward(milestonePopup.value.skillId, milestonePopup.value.milestone, text)
  milestonePopup.value = null
}

// ── 分组 ──────────────────────────────────────────────────────────────────
const groupedQuests = computed(() => {
  const groups = {}
  for (const q of questStore.quests) {
    const key = q.skillId ?? 'none'
    if (!groups[key]) groups[key] = []
    groups[key].push(q)
  }
  return Object.entries(groups).map(([skillId, quests]) => ({
    skillId: skillId === 'none' ? null : Number(skillId),
    label:   skillId === 'none' ? '无关联技能' : skillName(Number(skillId)),
    quests,
  }))
})

// ── 进度统计 ──────────────────────────────────────────────────────────────
const totalTasks  = computed(() => questStore.quests.length)
const doneTasks   = computed(() => questStore.quests.filter(q => q.status === 'done').length)
const activeTasks = computed(() => questStore.quests.filter(q => q.status === 'active').length)
</script>

<template>
  <div class="quests-page card">
    <!-- ── 标题行 ── -->
    <div class="page-header">
      <div class="title-group">
        <h3 class="card-title">任务中心</h3>
        <div class="task-counters">
          <span class="counter counter-active">{{ activeTasks }} 进行中</span>
          <span class="counter counter-done">{{ doneTasks }}/{{ totalTasks }} 已完成</span>
        </div>
      </div>
      <div class="header-right">
        <div class="view-toggle">
          <button class="toggle-btn" :class="{ active: viewMode==='list' }" @click="viewMode='list'">列表</button>
          <button class="toggle-btn" :class="{ active: viewMode==='grouped' }" @click="viewMode='grouped'">技能</button>
        </div>
        <button class="btn btn-primary btn-sm" @click="openAdd">＋ 新增</button>
      </div>
    </div>

    <!-- ── 当前专注任务横幅 ── -->
    <div v-if="questStore.currentFocusQuest" class="focus-banner">
      <Target :size="14" class="focus-icon" />
      <span class="focus-label">当前专注：</span>
      <span class="focus-name">{{ questStore.currentFocusQuest.name }}</span>
      <span class="focus-xp">+{{ questStore.currentFocusQuest.xp }} XP</span>
      <button class="focus-clear" @click="questStore.clearFocus()">✕</button>
    </div>

    <!-- ── 空状态 ── -->
    <div v-if="questStore.quests.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <h3>还没有任务</h3>
      <p>添加任务，每次完成都会积累经验值</p>
      <button class="btn btn-primary" @click="openAdd">创建第一个任务</button>
    </div>

    <!-- ── 列表视图 ── -->
    <div v-else-if="viewMode==='list'" class="quest-list">
      <div
        v-for="quest in questStore.quests"
        :key="quest.id"
        class="quest-card"
        :class="{ 'is-focused': questStore.currentFocusId === quest.id, 'is-done': quest.status === 'done' }"
      >
        <!-- 左侧：状态 + 名称 -->
        <div class="quest-left">
          <span class="status-badge" :class="STATUS_META[quest.status ?? 'pending']?.cls">
            {{ STATUS_META[quest.status ?? 'pending']?.label }}
          </span>
          <span class="quest-name">{{ quest.name }}</span>
        </div>

        <!-- 右侧：元信息 + 操作 -->
        <div class="quest-right">
          <div class="quest-chips">
            <span class="xp-chip">{{ quest.xp }} XP</span>
            <span class="skill-chip">{{ skillName(quest.skillId) }}</span>
            <span v-if="quest.estimatedPomodoros" class="pomo-chip">🍅×{{ quest.estimatedPomodoros }}</span>
            <span v-if="quest.count > 0" class="count-chip">完成 {{ quest.count }}x</span>
          </div>
          <div class="quest-actions">
            <button
              class="btn btn-focus btn-sm"
              :class="{ 'btn-focus-active': questStore.currentFocusId === quest.id }"
              @click="questStore.setFocus(quest.id)"
              :title="questStore.currentFocusId === quest.id ? '取消专注' : '开始专注'"
            >
              <Play :size="11" />
              {{ questStore.currentFocusId === quest.id ? '专注中' : '专注' }}
            </button>
            <button class="btn btn-complete btn-sm" @click="(e) => completeQuest(quest, e)">＋1</button>
            <button class="icon-btn" @click="openEdit(quest)"><Pencil :size="12" /></button>
            <button class="icon-btn danger" @click="deleteTarget = quest"><X :size="12" /></button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── 分组视图 ── -->
    <div v-else class="grouped-view">
      <div v-for="group in groupedQuests" :key="group.skillId ?? 'none'" class="group-block">
        <div class="group-label">{{ group.label }}</div>
        <div class="quest-list">
          <div
            v-for="quest in group.quests"
            :key="quest.id"
            class="quest-card"
            :class="{ 'is-focused': questStore.currentFocusId === quest.id, 'is-done': quest.status === 'done' }"
          >
            <div class="quest-left">
              <span class="status-badge" :class="STATUS_META[quest.status ?? 'pending']?.cls">
                {{ STATUS_META[quest.status ?? 'pending']?.label }}
              </span>
              <span class="quest-name">{{ quest.name }}</span>
            </div>
            <div class="quest-right">
              <div class="quest-chips">
                <span class="xp-chip">{{ quest.xp }} XP</span>
                <span v-if="quest.estimatedPomodoros" class="pomo-chip">🍅×{{ quest.estimatedPomodoros }}</span>
                <span v-if="quest.count > 0" class="count-chip">{{ quest.count }}x</span>
              </div>
              <div class="quest-actions">
                <button
                  class="btn btn-focus btn-sm"
                  :class="{ 'btn-focus-active': questStore.currentFocusId === quest.id }"
                  @click="questStore.setFocus(quest.id)"
                ><Play :size="11" /></button>
                <button class="btn btn-complete btn-sm" @click="(e) => completeQuest(quest, e)">＋1</button>
                <button class="icon-btn" @click="openEdit(quest)"><Pencil :size="12" /></button>
                <button class="icon-btn danger" @click="deleteTarget = quest"><X :size="12" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 演示数据提示 -->
    <p class="demo-hint">已预置演示数据，可随时删除或重置</p>
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
              <option :value="5">5 XP</option>
              <option :value="8">8 XP</option>
              <option :value="10">10 XP</option>
              <option :value="12">12 XP</option>
              <option :value="15">15 XP</option>
              <option :value="20">20 XP</option>
              <option :value="25">25 XP</option>
            </select>
          </div>
          <div class="form-group flex1">
            <label class="form-label">预计番茄数</label>
            <select v-model.number="formPomodoros" class="form-input">
              <option :value="1">1 🍅</option>
              <option :value="2">2 🍅</option>
              <option :value="3">3 🍅</option>
              <option :value="4">4 🍅</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group flex1">
            <label class="form-label">状态</label>
            <select v-model="formStatus" class="form-input">
              <option value="pending">待开始</option>
              <option value="active">进行中</option>
              <option value="done">已完成</option>
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
              <option :value="5">5 XP</option>
              <option :value="8">8 XP</option>
              <option :value="10">10 XP</option>
              <option :value="12">12 XP</option>
              <option :value="15">15 XP</option>
              <option :value="20">20 XP</option>
              <option :value="25">25 XP</option>
            </select>
          </div>
          <div class="form-group flex1">
            <label class="form-label">预计番茄数</label>
            <select v-model.number="editPomodoros" class="form-input">
              <option :value="1">1 🍅</option>
              <option :value="2">2 🍅</option>
              <option :value="3">3 🍅</option>
              <option :value="4">4 🍅</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group flex1">
            <label class="form-label">状态</label>
            <select v-model="editStatus" class="form-input">
              <option value="pending">待开始</option>
              <option value="active">进行中</option>
              <option value="done">已完成</option>
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
</template>

<style scoped>
.quests-page { display: flex; flex-direction: column; gap: 14px; }

/* 标题行 */
.page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
.title-group  { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.header-right { display: flex; align-items: center; gap: 8px; }
.card-title   { font-size: 0.8rem; font-weight: var(--fw-black); color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.06em; }

.task-counters { display: flex; gap: 6px; }
.counter {
  font-size: 0.72rem; font-weight: var(--fw-bold);
  padding: 3px 8px; border-radius: 20px; border: 2px solid #000;
  box-shadow: 1px 1px 0 #000;
}
.counter-active { background: var(--color-orange); }
.counter-done   { background: var(--color-mint); }

/* 当前专注横幅 */
.focus-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fff8e1;
  border: 2px solid var(--color-yellow);
  border-left: 4px solid #000;
  border-radius: var(--radius);
  box-shadow: 2px 2px 0 #000;
  font-size: 0.82rem;
  font-weight: var(--fw-bold);
}
.focus-icon  { color: var(--color-orange); flex-shrink: 0; }
.focus-label { color: var(--color-text-dim); flex-shrink: 0; }
.focus-name  { flex: 1; color: #000; font-weight: var(--fw-black); }
.focus-xp    { background: var(--color-yellow); padding: 2px 8px; border-radius: 12px; border: 2px solid #000; font-size: 0.72rem; }
.focus-clear { background: none; border: none; cursor: pointer; color: var(--color-text-dim); font-size: 0.8rem; padding: 2px 4px; transition: color 0.1s; }
.focus-clear:hover { color: #000; }

/* 视图切换 */
.view-toggle { display: flex; border: 2px solid #000; border-radius: 8px; overflow: hidden; box-shadow: 2px 2px 0 #000; }
.toggle-btn { padding: 5px 12px; background: #fff; border: none; font-family: var(--font-body); font-weight: var(--fw-bold); font-size: 0.8rem; cursor: pointer; transition: background 0.1s; }
.toggle-btn + .toggle-btn { border-left: 2px solid #000; }
.toggle-btn.active { background: #000; color: #fff; }

/* 空状态 */
.empty-state { text-align: center; padding: 48px 40px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.empty-icon  { font-size: 3rem; }
.empty-state h3 { font-size: 1.1rem; font-weight: var(--fw-black); }
.empty-state p  { font-size: 0.875rem; color: var(--color-text-dim); font-weight: 600; margin-bottom: 8px; }

/* 任务卡片 */
.quest-list { display: flex; flex-direction: column; gap: 8px; }
.quest-card {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 14px;
  background: #fff;
  border: 2px solid #000;
  border-radius: var(--radius);
  box-shadow: 2px 2px 0 #000;
  transition: transform 0.07s, box-shadow 0.07s;
}
.quest-card:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 #000; }
.quest-card.is-focused { border-color: #000; border-left: 4px solid var(--color-orange); background: #fff8e1; }
.quest-card.is-done    { opacity: 0.65; }

.quest-left  { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 180px; }
.quest-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-left: auto; }

.quest-name { font-weight: var(--fw-bold); font-size: 0.9rem; color: #000; }

/* 状态徽章 */
.status-badge {
  flex-shrink: 0;
  padding: 2px 8px; border-radius: 10px; border: 2px solid #000;
  font-size: 0.68rem; font-weight: var(--fw-black); white-space: nowrap;
  box-shadow: 1px 1px 0 #000;
}
.status-pending { background: #f0f0f0; }
.status-active  { background: var(--color-orange); }
.status-done    { background: var(--color-mint); }

/* 右侧 chip 组 */
.quest-chips { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
.xp-chip {
  padding: 2px 8px; background: var(--color-yellow);
  border: 2px solid #000; border-radius: 20px;
  font-size: 0.72rem; font-weight: var(--fw-black);
  box-shadow: 1px 1px 0 #000; white-space: nowrap;
}
.skill-chip {
  padding: 2px 8px; background: var(--color-sky);
  border: 2px solid #000; border-radius: 20px;
  font-size: 0.72rem; font-weight: var(--fw-bold);
  white-space: nowrap;
}
.pomo-chip {
  padding: 2px 7px; background: #fff0e8;
  border: 2px solid #000; border-radius: 20px;
  font-size: 0.68rem; font-weight: var(--fw-bold);
  white-space: nowrap;
}
.count-chip {
  padding: 2px 7px; background: #f0f0f0;
  border: 2px solid #000; border-radius: 20px;
  font-size: 0.68rem; font-weight: 600; color: var(--color-text-dim);
  white-space: nowrap;
}

/* 操作按钮组 */
.quest-actions { display: flex; align-items: center; gap: 5px; }

.btn-focus {
  background: #fff; color: #000;
  border: 2px solid #000; border-radius: 8px;
  padding: 5px 10px; font-size: 0.75rem;
  font-family: var(--font-body); font-weight: var(--fw-bold);
  cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
  box-shadow: 2px 2px 0 #000;
  transition: transform 0.07s, box-shadow 0.07s, background 0.1s;
}
.btn-focus:hover         { transform: translate(1px,1px); box-shadow: 1px 1px 0 #000; background: #f5f5f5; }
.btn-focus:active        { transform: translate(2px,2px); box-shadow: none; }
.btn-focus-active        { background: var(--color-orange) !important; }

.btn-complete {
  background: var(--color-mint); white-space: nowrap;
  border: 2px solid #000; border-radius: 8px;
  padding: 5px 10px; font-size: 0.75rem;
  font-family: var(--font-body); font-weight: var(--fw-bold);
  cursor: pointer; box-shadow: 2px 2px 0 #000;
  transition: transform 0.07s, box-shadow 0.07s;
}
.btn-complete:hover  { transform: translate(1px,1px); box-shadow: 1px 1px 0 #000; }
.btn-complete:active { transform: translate(2px,2px); box-shadow: none; }

.icon-btn {
  background: #fff; border: 2px solid #000; border-radius: 7px;
  width: 28px; height: 28px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 2px 2px 0 #000;
  transition: transform 0.07s, box-shadow 0.07s;
  color: var(--color-text-dim);
}
.icon-btn:hover { transform: translate(1px,1px); box-shadow: 1px 1px 0 #000; }
.icon-btn:active { transform: translate(2px,2px); box-shadow: none; }
.icon-btn.danger:hover { background: var(--color-pink); color: #000; }

/* 分组视图 */
.grouped-view { display: flex; flex-direction: column; gap: 18px; }
.group-block  { display: flex; flex-direction: column; gap: 8px; }
.group-label  { font-size: 0.82rem; font-weight: var(--fw-black); color: var(--color-text-dim); padding-left: 4px; text-transform: uppercase; letter-spacing: 0.04em; }

/* 里程碑弹窗 */
.milestone-box { border-color: #000; box-shadow: 8px 8px 0 #000; text-align: center; }
.ms-firework   { font-size: 3rem; animation: bounce 0.6s ease infinite alternate; }
@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-8px); } }
.ms-title { font-weight: var(--fw-black); }
.ms-sub   { font-size: 0.9rem; color: var(--color-text-dim); margin-bottom: 12px; font-weight: 600; }
.ms-sub strong { color: #000; font-weight: var(--fw-black); }

/* 演示提示 */
.demo-hint {
  font-size: 0.68rem; color: var(--color-text-muted); font-weight: 600;
  text-align: right; padding-top: 4px;
}

/* 表单 */
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.form-label { font-size: 0.82rem; font-weight: var(--fw-bold); color: var(--color-text-dim); }
.form-input { width: 100%; }
.form-error { font-size: 0.78rem; color: #c00; font-weight: 600; margin-top: -10px; }
.form-row   { display: flex; gap: 12px; }
.flex1 { flex: 1; }
.flex2 { flex: 2; }

/* XP 浮动 */
.float-layer { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }

@media (max-width: 600px) {
  .quest-card   { flex-direction: column; align-items: flex-start; }
  .quest-right  { width: 100%; justify-content: flex-start; }
  .quest-chips  { flex-wrap: wrap; }
}
</style>
