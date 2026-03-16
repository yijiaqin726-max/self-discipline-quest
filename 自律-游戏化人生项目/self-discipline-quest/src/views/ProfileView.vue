<script setup>
import { ref, computed } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import { useSkillStore } from '../stores/skillStore'

const profileStore = useProfileStore()
const skillStore = useSkillStore()

const { profile, level, levelTitle, nextLevelXP } = profileStore

// ── 行内编辑 ──────────────────────────────────────────────
const editingNickname = ref(false)
const editingMotto = ref(false)
const nicknameInput = ref('')
const mottoInput = ref('')

function startEdit(field) {
  if (field === 'nickname') {
    nicknameInput.value = profile.nickname
    editingNickname.value = true
  } else {
    mottoInput.value = profile.motto
    editingMotto.value = true
  }
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
  if (e.key === 'Escape') {
    editingNickname.value = false
    editingMotto.value = false
  }
}

// ── 头像 ──────────────────────────────────────────────────
const PRESET_AVATARS = ['🧙', '⚔️', '🛡️', '🏹', '🔮', '🐉']
const showAvatarPicker = ref(false)
const avatarInput = ref(null)

function pickPreset(icon) {
  profileStore.updateProfile({ avatar: icon })
  showAvatarPicker.value = false
}

function onAvatarFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    profileStore.updateProfile({ avatar: ev.target.result })
    showAvatarPicker.value = false
  }
  reader.readAsDataURL(file)
}

function isDataUrl(str) {
  return str && str.startsWith('data:')
}

// ── XP 进度条 ─────────────────────────────────────────────
const xpProgress = computed(() => {
  const xp = profile.totalXP
  const next = nextLevelXP
  if (!next) return 100
  // 找上一级门槛
  const LEVEL_MINS = [0, 100, 300, 600, 1000, 2000]
  const prevMin = LEVEL_MINS[level - 1] ?? 0
  return Math.min(100, Math.round(((xp - prevMin) / (next - prevMin)) * 100))
})

// ── 技能总览 ──────────────────────────────────────────────
const skills = computed(() => skillStore.skills)

function skillProgress(xp) {
  const next = skillStore.getNextMilestone(xp)
  if (!next) return 100
  const prev = skillStore.MILESTONES[skillStore.MILESTONES.indexOf(next) - 1] ?? 0
  return Math.min(100, Math.round(((xp - prev) / (next - prev)) * 100))
}

// ── 目标列表 ──────────────────────────────────────────────
const newGoalText = ref('')

function addGoal() {
  const t = newGoalText.value.trim()
  if (!t || profile.goals.length >= 8) return
  profileStore.addGoal(t)
  newGoalText.value = ''
}

function onGoalKeydown(e) {
  if (e.key === 'Enter') addGoal()
}
</script>

<template>
  <div class="profile-page">

    <!-- ── 角色卡片 ── -->
    <div class="hero-card card">
      <div class="hero-left">
        <!-- 头像 -->
        <div class="avatar-wrap" @click="showAvatarPicker = !showAvatarPicker">
          <div class="avatar">
            <img v-if="isDataUrl(profile.avatar)" :src="profile.avatar" alt="avatar" />
            <span v-else class="avatar-emoji">{{ profile.avatar || '🧙' }}</span>
          </div>
          <div class="avatar-edit-hint">点击换头像</div>
        </div>

        <!-- 头像选择器 -->
        <Transition name="fade">
          <div v-if="showAvatarPicker" class="avatar-picker">
            <div class="picker-presets">
              <button
                v-for="icon in PRESET_AVATARS"
                :key="icon"
                class="preset-btn"
                :class="{ active: profile.avatar === icon }"
                @click="pickPreset(icon)"
              >{{ icon }}</button>
            </div>
            <button class="btn btn-ghost btn-sm upload-btn" @click="avatarInput.click()">
              📁 上传图片
            </button>
            <input ref="avatarInput" type="file" accept="image/*" style="display:none" @change="onAvatarFileChange" />
          </div>
        </Transition>
      </div>

      <div class="hero-info">
        <!-- 昵称 -->
        <div class="nickname-row">
          <template v-if="editingNickname">
            <input
              v-model="nicknameInput"
              class="edit-input nickname-input"
              @blur="saveEdit('nickname')"
              @keydown="e => onEditKeydown(e, 'nickname')"
              autofocus
            />
          </template>
          <template v-else>
            <h1 class="nickname" @click="startEdit('nickname')">
              {{ profile.nickname }}
              <span class="edit-icon">✏️</span>
            </h1>
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
            <input
              v-model="mottoInput"
              class="edit-input motto-input"
              @blur="saveEdit('motto')"
              @keydown="e => onEditKeydown(e, 'motto')"
              autofocus
            />
          </template>
          <template v-else>
            <p class="motto" @click="startEdit('motto')">
              "{{ profile.motto }}"
              <span class="edit-icon">✏️</span>
            </p>
          </template>
        </div>

        <!-- XP 进度条 -->
        <div class="xp-section">
          <div class="xp-label">
            <span>总经验值</span>
            <span class="xp-value">{{ profile.totalXP }} XP
              <template v-if="nextLevelXP"> / {{ nextLevelXP }} XP</template>
              <template v-else> (满级!)</template>
            </span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: xpProgress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-grid">
      <!-- ── 技能总览 ── -->
      <div class="card skills-card">
        <h2 class="card-title">✨ 技能熟练度</h2>
        <div v-if="skills.length === 0" class="empty-hint">
          前往「技能熟练度」页面添加技能，完成任务后会在此展示
        </div>
        <ul v-else class="skill-list">
          <li v-for="skill in skills" :key="skill.id" class="skill-item">
            <div class="skill-header">
              <span class="skill-icon">{{ skill.icon }}</span>
              <span class="skill-name">{{ skill.name }}</span>
              <span class="skill-xp">{{ skill.xp }} XP</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: skillProgress(skill.xp) + '%' }"
              ></div>
            </div>
            <div class="skill-milestone-hint" v-if="skillStore.getNextMilestone(skill.xp)">
              距下一里程碑 {{ skillStore.getNextMilestone(skill.xp) - skill.xp }} XP
            </div>
          </li>
        </ul>
      </div>

      <!-- ── 目标列表 ── -->
      <div class="card goals-card">
        <h2 class="card-title">🎯 我的目标</h2>
        <ul class="goal-list">
          <li
            v-for="goal in profile.goals"
            :key="goal.id"
            class="goal-item"
            :class="{ done: goal.done }"
          >
            <button class="goal-check" @click="profileStore.toggleGoal(goal.id)">
              {{ goal.done ? '✅' : '⬜' }}
            </button>
            <span class="goal-text">{{ goal.text }}</span>
            <button class="goal-delete" @click="profileStore.removeGoal(goal.id)">✕</button>
          </li>
        </ul>

        <div v-if="profile.goals.length < 8" class="goal-add">
          <input
            v-model="newGoalText"
            placeholder="添加新目标，回车确认..."
            class="goal-input"
            @keydown="onGoalKeydown"
            maxlength="40"
          />
          <button class="btn btn-primary btn-sm" @click="addGoal">添加</button>
        </div>
        <p v-else class="goal-max-hint">最多添加 8 个目标</p>
      </div>
    </div>

  </div>
</template>

<style scoped>
.profile-page {
  padding: 32px;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ── 英雄卡片 ── */
.hero-card {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-color: rgba(245, 166, 35, 0.2);
}

.hero-left {
  position: relative;
  flex-shrink: 0;
}

/* 头像 */
.avatar-wrap {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid var(--color-gold);
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(245, 166, 35, 0.3);
  transition: box-shadow 0.2s;
}
.avatar-wrap:hover .avatar {
  box-shadow: 0 0 30px rgba(245, 166, 35, 0.5);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-emoji {
  font-size: 3rem;
  line-height: 1;
}

.avatar-edit-hint {
  font-size: 0.7rem;
  color: var(--color-text-dim);
}

/* 头像选择器 */
.avatar-picker {
  position: absolute;
  top: 115px;
  left: 0;
  z-index: 100;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 180px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

.picker-presets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.preset-btn {
  font-size: 1.6rem;
  background: var(--color-bg);
  border: 2px solid transparent;
  border-radius: var(--radius);
  cursor: pointer;
  padding: 6px;
  transition: all 0.2s;
  line-height: 1;
}
.preset-btn:hover,
.preset-btn.active {
  border-color: var(--color-gold);
  background: rgba(245,166,35,0.1);
}

.upload-btn {
  width: 100%;
  justify-content: center;
}

/* 角色信息 */
.hero-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nickname-row, .motto-row {
  display: flex;
  align-items: center;
}

.nickname {
  font-family: var(--font-pixel);
  font-size: 0.85rem;
  color: var(--color-gold);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.6;
}

.motto {
  color: var(--color-text-dim);
  font-style: italic;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-icon {
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.2s;
}
.nickname:hover .edit-icon,
.motto:hover .edit-icon {
  opacity: 1;
}

.edit-input {
  font-size: 0.9rem;
  padding: 4px 8px;
  width: 100%;
  max-width: 320px;
}

.nickname-input {
  font-family: var(--font-pixel);
  font-size: 0.75rem;
  color: var(--color-gold);
}

/* 等级徽章 */
.level-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-level {
  background: rgba(245, 166, 35, 0.2);
  color: var(--color-gold);
  border: 1px solid rgba(245, 166, 35, 0.4);
}

.badge-title {
  background: rgba(233, 69, 96, 0.15);
  color: var(--color-red);
  border: 1px solid rgba(233, 69, 96, 0.3);
  font-family: var(--font-pixel);
  font-size: 0.55rem;
  letter-spacing: 0.05em;
}

/* XP 进度 */
.xp-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 400px;
}

.xp-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--color-text-dim);
}

.xp-value {
  color: var(--color-gold);
  font-weight: 600;
}

/* ── 底部两列 ── */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.card-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
}

/* ── 技能总览 ── */
.empty-hint {
  font-size: 0.82rem;
  color: var(--color-text-dim);
  line-height: 1.6;
}

.skill-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.skill-icon { font-size: 1rem; }
.skill-name { flex: 1; }
.skill-xp { color: var(--color-gold); font-size: 0.8rem; font-weight: 600; }

.skill-milestone-hint {
  font-size: 0.72rem;
  color: var(--color-text-dim);
}

/* ── 目标列表 ── */
.goal-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  min-height: 40px;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--color-bg);
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  transition: opacity 0.2s;
}

.goal-item.done .goal-text {
  text-decoration: line-through;
  color: var(--color-text-dim);
}

.goal-check {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  flex-shrink: 0;
}

.goal-text {
  flex: 1;
  font-size: 0.875rem;
  word-break: break-all;
}

.goal-delete {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 2px 4px;
  border-radius: 4px;
  transition: color 0.2s;
  flex-shrink: 0;
}
.goal-delete:hover { color: var(--color-red); }

.goal-add {
  display: flex;
  gap: 8px;
  align-items: center;
}

.goal-input {
  flex: 1;
  font-size: 0.83rem;
}

.goal-max-hint {
  font-size: 0.78rem;
  color: var(--color-text-dim);
}

/* 响应式 */
@media (max-width: 700px) {
  .hero-card { flex-direction: column; }
  .bottom-grid { grid-template-columns: 1fr; }
  .profile-page { padding: 16px; }
}
</style>
