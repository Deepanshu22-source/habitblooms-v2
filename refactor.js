const fs = require('fs');
const path = require('path');

// 1. Move DashboardClient -> TodayTab
let todayTab = fs.readFileSync('components/dashboard/DashboardClient.tsx', 'utf8');
todayTab = todayTab.replace(/export default function DashboardClient/g, 'export default function TodayTab');
fs.writeFileSync('components/dashboard/tabs/TodayTab.tsx', todayTab);
fs.unlinkSync('components/dashboard/DashboardClient.tsx');

// 2. Move CommunityPage -> CommunityTab
let communityTab = fs.readFileSync('app/(dashboard)/community/page.tsx', 'utf8');
communityTab = communityTab.replace(/export default function CommunityPage/g, 'export default function CommunityTab');
// Remove the 'use client' if it's there (we will have it in MasterClient, but fine to keep)
fs.writeFileSync('components/dashboard/tabs/CommunityTab.tsx', communityTab);

// 3. Move ProfilePage -> ProfileTab
let profileTab = fs.readFileSync('app/(dashboard)/profile/page.tsx', 'utf8');
profileTab = profileTab.replace(/export default function ProfilePage/g, 'export default function ProfileTab');
fs.writeFileSync('components/dashboard/tabs/ProfileTab.tsx', profileTab);

// 4. Move AnalyticsPage -> AnalyticsTab
let analyticsTab = fs.readFileSync('app/(dashboard)/analytics/page.tsx', 'utf8');
analyticsTab = analyticsTab.replace(/export default function AnalyticsPage/g, 'export default function AnalyticsTab');
fs.writeFileSync('components/dashboard/tabs/AnalyticsTab.tsx', analyticsTab);

console.log("Moved files to tabs directory.");
