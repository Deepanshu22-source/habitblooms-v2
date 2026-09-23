# 🌸 HabitBlooms - Complete User Guide

Welcome to **HabitBlooms**! This is a complete breakdown of every feature, psychological mechanic, and anti-cheat system built into the app to help you stay productive and grow your virtual garden.

---

## 1. The Core Architecture (0-Second Navigation)
HabitBlooms is built as a **Single Page Application (SPA)**. 
- **What this means for you:** When you tap the bottom navigation buttons (Today, Habits, Community, Analytics), the app does not load a new webpage. It swaps the screen instantly (0.0 seconds). This gives it the buttery-smooth, lag-free feel of a premium native iOS app.

---

## 2. The "Today" Tab (Your Daily Dashboard)
This is your main control center where you log your daily actions.

* **Custom Scheduling:** When you create a habit, you can pick specific days (e.g., only Mondays and Wednesdays). On your dashboard, the app automatically hides habits that aren't scheduled for today, keeping your screen clean and focused.
* **The Progress Ring:** The green circular progress bar only tracks the habits that are scheduled for *today*. 
* **Quick Edits:** You can tap the small "Pencil" icon directly on a habit card to instantly change its schedule or name. (Note: To prevent cheating, you cannot un-schedule a habit for *today* once today has started).

---

## 3. The Gamified Economy (Seeds & Score)
HabitBlooms uses a highly balanced gaming economy to keep you motivated.
Every time you complete a habit, you earn **Seeds** (currency) and **Score** (leaderboard points).

### The "Diminishing Returns" Anti-Spam System
To prevent users from creating 100 fake habits just to get rich, the app rewards you based on how many habits you've already done today:
* **Habits 1 to 10:** You earn **+10** Seeds/Score per completion.
* **Habits 11 to 20:** You earn **+5** Seeds/Score per completion.
* **Habits 21+:** You earn **+1** Seed/Score per completion.
*(This caps daily earnings at around 150 points, keeping the playing field fair for everyone).*

### The "Delete Penalty"
If a user tries to cheat by creating a fake habit, checking it off to get 10 seeds, and immediately deleting it to hide the evidence... The system instantly catches it and subtracts the 10 seeds back out of their wallet before deleting the habit.

---

## 4. The Virtual Plant & Streaks
Your dashboard features a living Virtual Plant that reflects your consistency.

* **Plant Health:** Starts at 100/100. Every time you complete a habit, your plant gains health. Over time, your plant will visually evolve and grow.
* **The "Perfect Day" Rule:** Your overall account "Streak" (the fire icon) will only go up if you complete **100% of your scheduled habits** for the day. If you complete 4 out of 5 habits, your streak does not increase. 
* **Streak At Risk:** If you miss a Perfect Day, a red warning banner appears the next morning. Your streak is frozen, and you have until midnight to repair it or it drops to 0!

---

## 5. The Store (Lifelines)
In the top right corner of your Dashboard, you can access the **Shop**.
* You can spend the **Seeds** you've earned from completing habits to buy a **Streak Freeze** (costs 500 Seeds).
* If your streak is at risk, you can use a stored Streak Freeze to magically repair it and save your progress. Because of the daily earning limits, a Streak Freeze requires roughly 4 days of consistent, hard work to afford!

---

## 6. The Community & Leaderboard
Under the **Community** tab, you compete with other users who share your same exam or life goal.

* **The Live Feed:** Shows a real-time list of when other users are completing their habits, keeping you motivated.
* **The Weekly League:** The leaderboard is ranked by your **Score**. 
* **The Sunday Reset:** At exactly Sunday Midnight (Indian Standard Time), the "Midnight Robot" automatically archives the past week, resets everyone's Leaderboard Score back to 0, and sends a push notification that the new Weekly League has begun!

---

## 7. Intelligent Push Notifications
HabitBlooms uses a smart, Vercel-powered notification engine that operates perfectly in Indian Standard Time (IST).

* **Custom Reminders:** When you create a habit, you can set a specific reminder time (e.g., 10:30 AM). The server will ping your phone at exactly that hour.
* **Daily Broadcasts:** The app automatically sends motivational bumps throughout the day:
    * **8:00 AM:** Morning motivation.
    * **1:00 PM:** Mid-day check-in.
    * **8:00 PM:** Evening wrap-up.
    * **10:00 PM:** The Midnight Warning (reminding you to save your streak before the day ends).

*(Note: Push notifications work seamlessly through the browser. You just need to click "Enable Alerts" in the top navigation bar).*
