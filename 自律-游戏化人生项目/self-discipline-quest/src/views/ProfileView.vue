<script setup>
import { ref, computed } from 'vue'
import { useProfileStore } from '../stores/profileStore'

const profileStore = useProfileStore()

const { profile, level, levelTitle, nextLevelXP } = profileStore

// ── 行内编辑 ──────────────────────────────────────────────
const editingNickname = ref(false)
const editingMotto    = ref(false)
const nicknameInput   = ref('')
const mottoInput      = ref('')

function startEdit(field) {
  if (field === 'nickname') { nicknameInput.value = profile.nickname; editingNickname.value = true }
  else { mottoInput.value = profile.motto; editingMotto.value = true }
}
function saveEdit(field) {
  if (field === 'nickname') {
    const v = nicknameInput.value.trim()
    if (v) profileStore.updateProfile({ nickname: v })
    editingNickname.value = false
  } else {
    const v = mottoInput.value.trim()
    if (v) profileStore.updateProfile({ motto: v })
    editingMotto.value = false
  }
}
function onEditKeydown(e, field) {
  if (e.key === 'Enter') saveEdit(field)
  if (e.key === 'Escape') { editingNickname.value = false; editingMotto.value = false }
}

// ── 头像 ──────────────────────────────────────────────────
const PRESET_AVATARS = ['🧙', '⚔️', '🛡️', '🏹', '🔮', '🐉']
const showAvatarPicker = ref(false)
const avatarInput      = ref(null)

function pickPreset(icon) { profileStore.updateProfile({ avatar: icon }); showAvatarPicker.value = false }
function onAvatarFileChange(e) {
  const file = e.target.files[0]; if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { profileStore.updateProfile({ avatar: ev.target.result }); showAvatarPicker.value = false }
  reader.readAsDataURL(file)
}
const isDataUrl = (str) => str && str.startsWith('data:')

// ── XP 进度 ───────────────────────────────────────────────
const xpProgress = computed(() => {
  const xp = profile.totalXP
  const next = nextLevelXP
  if (!next) return 100
  const LEVEL_MINS = [0, 100, 300, 600, 1000, 2000]
  const prevMin = LEVEL_MINS[level - 1] ?? 0
  return Math.min(100, Math.round(((xp - prevMin) / (next - prevMin)) * 100))
})

// ── 目标列表 ──────────────────────────────────────────────
const newGoalText = ref('')
function addGoal() {
  const t = newGoalText.value.trim()
  if (!t || profile.goals.length >= 8) return
  profileStore.addGoal(t)
  newGoalText.value = ''
}
function onGoalKeydown(e) { if (e.key === 'Enter') addGoal() }
</script>

<template>
  <div class="profile-page card">
    <h3 class="card-title">我的主页</h3>

    <!-- ── 角色卡片 ── -->
    <div class="hero-card">
      <!-- 头像区 -->
      <div class="hero-left">
        <div class="avatar-wrap" @click="showAvatarPicker = !showAvatarPicker">
          <div class="avatar">
            <img v-if="isDataUrl(profile.avatar)" :src="profile.avatar" alt="avatar" />
            <span v-else class="avatar-emoji">{{ profile.avatar || '🧙' }}</span>
          </div>
          <div class="avatar-hint">点击换头像</div>
        </div>
        <Transition name="fade">
          <div v-if="showAvatarPicker" class="avatar-picker">
            <div class="picker-presets">
              <button v-for="icon in PRESET_AVATARS" :key="icon" class="preset-btn" :class="{ active: profile.avatar === icon }" @click="pickPreset(icon)">{{ icon }}</button>
            </div>
            <button class="btn btn-ghost btn-sm upload-btn" @click="avatarInput.click()">📁 上传图片</button>
            <input ref="avatarInput" type="file" accept="image/*" style="display:none" @change="onAvatarFileChange" />
          </div>
        </Transition>
      </div>

      <!-- 信息区 -->
      <div class="hero-info">
        <!-- 昵称 -->
        <div class="nickname-row">
          <template v-if="editingNickname">
            <input v-model="nicknameInput" class="edit-input nickname-input" @blur="saveEdit('nickname')" @keydown="e => onEditKeydown(e,'nickname')" autofocus />
          </template>
          <template v-else>
            <h2 class="nickname" @click="startEdit('nickname')">{{ profile.nickname }}<span class="edit-icon">✏️</span></h2>
          </template>
        </div>

        <!-- 等级徽章 -->
        <div class="level-badges">
          <span class="badge badge-level">Lv.{{ level }}</span>
          <span class="badge badge-title">{{ levelTitle }}</span>
        </div>

        <!-- 座右铭 -->
        <div class="motto-row">
          <template v-if="editingMotto">
            <input v-model="mottoInput" class="edit-input" @blur="saveEdit('motto')" @keydown="e => onEditKeydown(e,'motto')" autofocus />
          </template>
          <template v-else>
            <p class="motto" @click="startEdit('motto')">"{{ profile.motto }}"<span class="edit-icon">✏️</span></p>
          </template>
        </div>

        <!-- XP 进度条 -->
        <div class="xp-section">
          <div class="xp-label">
            <span class="xp-text">总经验值</span>
            <span class="xp-val">{{ profile.totalXP }} XP<template v-if="nextLevelXP"> / {{ nextLevelXP }}</template><template v-else> 满级🏆</template></span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: xpProgress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── 目标列表 ── -->
    <div class="goals-section">
      <h4 class="section-sub">🎯 我的目标</h4>
      <ul class="goal-list">
        <li v-for="goal in profile.goals" :key="goal.id" class="goal-item" :class="{ done: goal.done }">
          <button class="goal-check" @click="profileStore.toggleGoal(goal.id)">{{ goal.done ? '✅' : '⬜' }}</button>
          <span class="goal-text">{{ goal.text }}</span>
          <button class="goal-delete" @click="profileStore.removeGoal(goal.id)">✕</button>
        </li>
      </ul>
      <div v-if="profile.goals.length < 8" class="goal-add">
        <input v-model="newGoalText" placeholder="添加新目标，回车确认..." class="goal-input" @keydown="onGoalKeydown" maxlength="40" />
        <button class="btn btn-primary btn-sm" @click="addGoal">添加</button>
      </div>
      <p v-else class="goal-max">最多 8 个目标</p>
    </div>
  </div>
</template>

<style scoped>
.profile-page { display: flex; flex-direction: column; gap: 16px; }
.card-title { font-size: 0.8rem; font-weight: var(--fw-black); color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }

/* ── 角色卡片 ── */
.hero-card {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.hero-left { position: relative; flex-shrink: 0; }

/* 头像 */
.avatar-wrap {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.avatar {
  width: 80px; height: 80px;
  border-radius: 50%;
  border: 3px solid #000;
  box-shadow: 3px 3px 0 #000;
  background: var(--color-yellow);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.1s;
}
.avatar-wrap:hover .avatar { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 #000; }
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-emoji { font-size: 2.2rem; line-height: 1; }
.avatar-hint { font-size: 0.62rem; font-weight: var(--fw-bold); color: var(--color-text-muted); }

/* 头像选择器 */
.avatar-picker {
  position: absolute;
  top: 95px; left: 0;
  z-index: 100;
  background: #fff;
  border: 2px solid #000;
  border-radius: var(--radius);
  padding: 10px;
  box-shadow: 4px 4px 0 #000;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.picker-presets { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.preset-btn {
  font-size: 1.4rem;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  padding: 4px;
  transition: all 0.1s;
}
.preset-btn:hover, .preset-btn.active { border-color: #000; background: var(--color-yellow); }
.upload-btn { width: 100%; justify-content: center; }

/* 角色信息 */
.hero-info { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.nickname-row, .motto-row { display: flex; align-items: center; }
.nickname {
  font-family: var(--font-body);
  font-size: 1.3rem;
  font-weight: var(--fw-black);
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.2;
}
.motto {
  color: var(--color-text-dim);
  font-style: italic;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.edit-icon { font-size: 0.7rem; opacity: 0; transition: opacity 0.15s; }
.nickname:hover .edit-icon, .motto:hover .edit-icon { opacity: 1; }
.edit-input { font-size: 0.95rem; font-weight: var(--fw-bold); max-width: 280px; }
.nickname-input { font-size: 1.1rem; font-weight: var(--fw-black); }

/* 等级徽章 */
.level-badges { display: flex; gap: 6px; flex-wrap: wrap; }

/* XP */
.xp-section { display: flex; flex-direction: column; gap: 5px; }
.xp-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: var(--fw-bold); }
.xp-text { color: var(--color-text-dim); }
.xp-val { color: #000; font-weight: var(--fw-black); }

/* ── 目标列表 ── */
.goals-section { display: flex; flex-direction: column; gap: 10px; padding-top: 12px; border-top: 2px solid #e8e8e8; }
.section-sub { font-size: 0.78rem; font-weight: var(--fw-black); color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.05em; }
.goal-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.goal-item {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px;
  background: var(--color-bg);
  border-radius: var(--radius);
  border: 2px solid #000;
  box-shadow: 2px 2px 0 #000;
  transition: transform 0.07s;
}
.goal-item:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 #000; }
.goal-item.done .goal-text { text-decoration: line-through; color: var(--color-text-muted); }
.goal-check { background: none; border: none; cursor: pointer; font-size: 0.9rem; padding: 0; flex-shrink: 0; }
.goal-text { flex: 1; font-size: 0.82rem; font-weight: 600; word-break: break-all; }
.goal-delete { background: none; border: none; color: var(--color-text-muted); cursor: pointer; font-size: 0.75rem; padding: 2px 4px; border-radius: 4px; transition: color 0.15s; flex-shrink: 0; }
.goal-delete:hover { color: #000; }
.goal-add { display: flex; gap: 8px; align-items: center; }
.goal-input { flex: 1; font-size: 0.82rem; }
.goal-max { font-size: 0.72rem; color: var(--color-text-dim); font-weight: 600; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
