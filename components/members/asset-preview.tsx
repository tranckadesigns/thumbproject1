"use client";

import {
  YouTubeRevenueOverlay,
  StripePayoutOverlay,
  SubscriberMilestoneOverlay,
  ShopifySalesOverlay,
  CTRAnalyticsOverlay,
  InstagramAlertOverlay,
  GrowthChartOverlay,
  AlertBannerOverlay,
  BestWorstOverlay,
  RatingStarsOverlay,
  CountdownTimerOverlay,
  ChallengeProgressOverlay,
  PollResultOverlay,
  ReactionBubbleOverlay,
  BeforeAfterOverlay,
  AdSenseRevenueOverlay,
  PayPalPayoutOverlay,
  LiveTickerOverlay,
  OneMilOverlay,
  WeeklyGainOverlay,
  ViewsMilestoneOverlay,
  ChannelStatsOverlay,
  BreakingNewsOverlay,
  NotificationCardOverlay,
  TwitterCardOverlay,
  TikTokFYPOverlay,
  DigitalSaleOverlay,
  CourseEnrollmentOverlay,
  WatchTimeOverlay,
  ImpressionsOverlay,
  HundredDayChallengeOverlay,
  WeeklyStreakOverlay,
  OldVsNewOverlay,
  ProductScoreOverlay,
  AppStoreRatingOverlay,
  EventCountdownOverlay,
  StreamGoLiveOverlay,
  CommunityVoteOverlay,
  LiveChatOverlay,
} from "@/components/marketing/asset-overlays";

const slugOverlayMap: Record<string, () => React.ReactElement> = {
  "youtube-revenue-alert":       YouTubeRevenueOverlay,
  "stripe-payout-notification":  StripePayoutOverlay,
  "adsense-revenue-card":        AdSenseRevenueOverlay,
  "paypal-payout-badge":         PayPalPayoutOverlay,
  "100k-subscriber-milestone":   SubscriberMilestoneOverlay,
  "subscriber-count-ticker":     LiveTickerOverlay,
  "1m-subscriber-badge":         OneMilOverlay,
  "weekly-subscriber-gain":      WeeklyGainOverlay,
  "viral-growth-chart":          GrowthChartOverlay,
  "views-milestone-popup":       ViewsMilestoneOverlay,
  "channel-performance-card":    ChannelStatsOverlay,
  "real-time-alert-banner":      AlertBannerOverlay,
  "breaking-update-banner":      BreakingNewsOverlay,
  "important-notification-card": NotificationCardOverlay,
  "instagram-follower-spike":    InstagramAlertOverlay,
  "twitter-viral-card":          TwitterCardOverlay,
  "tiktok-fyp-badge":            TikTokFYPOverlay,
  "shopify-sales-dashboard":     ShopifySalesOverlay,
  "digital-product-sale-badge":  DigitalSaleOverlay,
  "course-enrollment-counter":   CourseEnrollmentOverlay,
  "ctr-analytics-display":       CTRAnalyticsOverlay,
  "watch-time-dashboard":        WatchTimeOverlay,
  "impressions-analytics-card":  ImpressionsOverlay,
  "30-day-challenge-progress":   ChallengeProgressOverlay,
  "100-day-challenge-tracker":   HundredDayChallengeOverlay,
  "weekly-streak-badge":         WeeklyStreakOverlay,
  "best-vs-worst-comparison":    BestWorstOverlay,
  "before-after-reveal":         BeforeAfterOverlay,
  "old-vs-new-comparison":       OldVsNewOverlay,
  "five-star-rating-display":    RatingStarsOverlay,
  "product-score-badge":         ProductScoreOverlay,
  "app-store-rating-card":       AppStoreRatingOverlay,
  "launch-countdown-timer":      CountdownTimerOverlay,
  "live-event-countdown":        EventCountdownOverlay,
  "stream-golive-timer":         StreamGoLiveOverlay,
  "poll-result-overlay":         PollResultOverlay,
  "reaction-bubble-overlay":     ReactionBubbleOverlay,
  "community-vote-card":         CommunityVoteOverlay,
  "live-chat-reactions":         LiveChatOverlay,
};

interface AssetPreviewProps {
  slug: string;
}

export function AssetPreview({ slug }: AssetPreviewProps) {
  const Overlay = slugOverlayMap[slug] ?? YouTubeRevenueOverlay;
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#161616]">
      <Overlay />
    </div>
  );
}
