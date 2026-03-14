-- ─────────────────────────────────────────────────────────────────────────────
-- PSDfuel — Seed Data
-- Run AFTER 001_schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.assets
  (slug, title, short_description, full_description, category, platform_type, style_type, thumbnail_url, preview_images, psd_file_key, file_size_mb, version, is_featured, is_published, tags, created_at)
values

-- ── Revenue ──────────────────────────────────────────────────────────────────
(
  'youtube-revenue-alert', 'YouTube Revenue Alert',
  'Monthly earnings notification styled exactly like YouTube Studio.',
  'A fully layered PSD showing a YouTube Studio monthly revenue notification. Swap in any dollar amount in seconds. Includes the red YouTube icon, percentage growth badge, and progress bar — all on separate named layers.',
  'Revenue', 'YouTube', 'Dark', '', '{}', 'revenue/youtube-revenue-alert.psd',
  18.4, '1.0', true, true,
  ARRAY['revenue','youtube','earnings','notification','monthly'],
  '2026-01-15T10:00:00Z'
),
(
  'stripe-payout-notification', 'Stripe Payout Notification',
  'Stripe-styled payout card showing your income amount.',
  'Pixel-perfect Stripe payout notification overlay. Shows the payout amount, currency, destination, and status badge. Every text element is editable.',
  'Revenue', 'General', 'Dark', '', '{}', 'revenue/stripe-payout-notification.psd',
  14.2, '1.0', false, true,
  ARRAY['stripe','payout','income','money','earnings'],
  '2026-01-18T10:00:00Z'
),
(
  'adsense-revenue-card', 'AdSense Revenue Card',
  'Google AdSense styled monthly earnings summary.',
  'A clean Google AdSense dashboard card showing estimated earnings, page RPM, and impressions. Designed to look authentic inside a YouTube thumbnail. All values are on separate text layers.',
  'Revenue', 'YouTube', 'Dark', '', '{}', 'revenue/adsense-revenue-card.psd',
  16.1, '1.0', false, true,
  ARRAY['adsense','google','earnings','rpm','revenue'],
  '2026-02-01T10:00:00Z'
),
(
  'paypal-payout-badge', 'PayPal Payout Badge',
  'PayPal-styled payout received notification.',
  'A PayPal payment received notification styled like the native PayPal mobile app. Shows transaction amount, sender info, and timestamp. Fully editable text layers.',
  'Revenue', 'General', 'Dark', '', '{}', 'revenue/paypal-payout-badge.psd',
  11.8, '1.0', false, true,
  ARRAY['paypal','payout','payment','income','notification'],
  '2026-02-04T10:00:00Z'
),

-- ── Subscribers ──────────────────────────────────────────────────────────────
(
  '100k-subscriber-milestone', '100K Subscriber Milestone',
  'Celebrate 100K with a bold subscriber milestone popup.',
  'The iconic subscriber milestone overlay. Shows the subscriber count with a YouTube play button award style badge. Fully editable — works for any milestone from 1K to 10M.',
  'Subscribers', 'YouTube', 'Bold', '', '{}', 'subscribers/100k-subscriber-milestone.psd',
  22.1, '1.0', true, true,
  ARRAY['subscribers','milestone','100k','youtube','celebration'],
  '2026-01-20T10:00:00Z'
),
(
  'subscriber-count-ticker', 'Live Subscriber Count Ticker',
  'Real-time style subscriber counter overlay.',
  'A live-counter style subscriber display showing your channel count with a ticker aesthetic. Includes the subscriber number, channel icon placeholder, and a subtle live indicator.',
  'Subscribers', 'YouTube', 'Minimal', '', '{}', 'subscribers/subscriber-count-ticker.psd',
  11.8, '1.0', false, true,
  ARRAY['subscribers','counter','live','growth','channel'],
  '2026-01-22T10:00:00Z'
),
(
  '1m-subscriber-badge', '1M Subscriber Badge',
  'Premium gold badge for hitting one million subscribers.',
  'A premium subscriber milestone badge celebrating 1 million subscribers. Includes a custom award ribbon, sparkle effects, and the subscriber count. Editable count works for any number.',
  'Subscribers', 'YouTube', 'Bold', '', '{}', 'subscribers/1m-subscriber-badge.psd',
  24.7, '1.0', true, true,
  ARRAY['1m','subscribers','milestone','gold','celebration'],
  '2026-02-06T10:00:00Z'
),
(
  'weekly-subscriber-gain', 'Weekly Subscriber Gain',
  'Weekly new subscriber count with growth percentage.',
  'A clean weekly performance card showing new subscribers gained this week with a percentage change indicator. Minimal design that works on any thumbnail background.',
  'Subscribers', 'YouTube', 'Minimal', '', '{}', 'subscribers/weekly-subscriber-gain.psd',
  9.4, '1.0', false, true,
  ARRAY['subscribers','weekly','growth','gain','performance'],
  '2026-02-09T10:00:00Z'
),

-- ── Growth ────────────────────────────────────────────────────────────────────
(
  'viral-growth-chart', 'Viral Growth Chart',
  'Upward trending chart showing explosive channel growth.',
  'A sleek analytics-style growth chart overlay showing a dramatic upward curve. Includes editable data points, percentage increase badge, and time period label.',
  'Growth', 'YouTube', 'Dark', '', '{}', 'growth/viral-growth-chart.psd',
  16.5, '1.0', true, true,
  ARRAY['growth','chart','analytics','trending','viral'],
  '2026-01-25T10:00:00Z'
),
(
  'views-milestone-popup', 'Views Milestone Popup',
  'Celebrate a views milestone with a bold popup overlay.',
  'A bold views milestone popup showing total view count with animated-style background effect. Works for any views milestone — 100K, 1M, 10M. Count and label are on separate layers.',
  'Growth', 'YouTube', 'Bold', '', '{}', 'growth/views-milestone-popup.psd',
  14.2, '1.0', false, true,
  ARRAY['views','milestone','popup','achievement','youtube'],
  '2026-02-11T10:00:00Z'
),
(
  'channel-performance-card', 'Channel Performance Card',
  'Overview card with views, subs, and watch time.',
  'A compact dashboard-style card showing three key channel metrics: total views, subscriber count, and watch hours. All three values are editable. Clean dark design.',
  'Growth', 'YouTube', 'Dark', '', '{}', 'growth/channel-performance-card.psd',
  12.8, '1.0', false, true,
  ARRAY['performance','channel','metrics','overview','stats'],
  '2026-02-14T10:00:00Z'
),

-- ── Alerts ────────────────────────────────────────────────────────────────────
(
  'real-time-alert-banner', 'Real-Time Alert Banner',
  'System alert notification banner with custom message.',
  'A notification-style alert banner overlay. Styled like a mobile system notification with icon, title, and body text — all fully editable.',
  'Alerts', 'General', 'Dark', '', '{}', 'alerts/real-time-alert-banner.psd',
  9.3, '1.0', false, true,
  ARRAY['alert','notification','banner','warning','system'],
  '2026-01-28T10:00:00Z'
),
(
  'breaking-update-banner', 'Breaking Update Banner',
  'News-style breaking update banner for urgent content.',
  'A news ticker-style breaking update banner. Red urgency strip with headline and subtext. Works great for news commentary, major announcements, and reaction content.',
  'Alerts', 'General', 'Bold', '', '{}', 'alerts/breaking-update-banner.psd',
  8.7, '1.0', false, true,
  ARRAY['breaking','news','banner','urgent','announcement'],
  '2026-02-16T10:00:00Z'
),
(
  'important-notification-card', 'Important Notification Card',
  'Clean notification card with title, icon, and message.',
  'A minimal notification card with icon, bold title, and body text. Three color variants included (info, warning, success) as separate layer groups. Editable text throughout.',
  'Alerts', 'General', 'Minimal', '', '{}', 'alerts/important-notification-card.psd',
  10.2, '1.0', false, true,
  ARRAY['notification','card','info','important','alert'],
  '2026-02-19T10:00:00Z'
),

-- ── Social ────────────────────────────────────────────────────────────────────
(
  'instagram-follower-spike', 'Instagram Follower Spike',
  'Instagram-styled follower count notification.',
  'A follower notification styled like a native Instagram UI element. Shows the follower count, profile avatar placeholder, and a growth indicator.',
  'Social', 'General', 'Dark', '', '{}', 'social/instagram-follower-spike.psd',
  12.7, '1.0', false, true,
  ARRAY['instagram','followers','social','growth','notification'],
  '2026-02-01T10:00:00Z'
),
(
  'twitter-viral-card', 'Twitter / X Viral Card',
  'Twitter/X styled post showing viral engagement stats.',
  'A Twitter/X post card showing likes, retweets, views, and quote count. Styled exactly like the native X app. Editable username, handle, post text, and all engagement numbers.',
  'Social', 'General', 'Dark', '', '{}', 'social/twitter-viral-card.psd',
  11.3, '1.0', false, true,
  ARRAY['twitter','x','viral','social','engagement'],
  '2026-02-22T10:00:00Z'
),
(
  'tiktok-fyp-badge', 'TikTok For You Badge',
  'TikTok-styled For You page views notification.',
  'A TikTok notification card showing video views, likes, and shares. Styled like the native TikTok UI with the signature font and color treatment. All metrics are fully editable.',
  'Social', 'General', 'Bold', '', '{}', 'social/tiktok-fyp-badge.psd',
  10.5, '1.0', false, true,
  ARRAY['tiktok','fyp','views','social','viral'],
  '2026-02-25T10:00:00Z'
),

-- ── E-Commerce ────────────────────────────────────────────────────────────────
(
  'shopify-sales-dashboard', 'Shopify Sales Dashboard',
  'Shopify-styled sales overview card showing total revenue.',
  'A dashboard-style Shopify sales card showing total sales, order count, and conversion rate. Styled to look exactly like the Shopify admin app.',
  'E-Commerce', 'General', 'Dark', '', '{}', 'commerce/shopify-sales-dashboard.psd',
  19.8, '1.0', true, true,
  ARRAY['shopify','ecommerce','sales','dashboard','revenue'],
  '2026-02-05T10:00:00Z'
),
(
  'digital-product-sale-badge', 'Digital Product Sale Badge',
  'Sales notification for digital products and courses.',
  'A clean sale notification badge for digital products. Shows product name, price, and quantity sold. Works for courses, templates, presets, or any digital product.',
  'E-Commerce', 'General', 'Minimal', '', '{}', 'commerce/digital-product-sale-badge.psd',
  9.6, '1.0', false, true,
  ARRAY['digital','product','sale','course','commerce'],
  '2026-02-28T10:00:00Z'
),
(
  'course-enrollment-counter', 'Course Enrollment Counter',
  'Student enrollment count badge for online courses.',
  'An enrollment counter showing the number of students enrolled in a course with a progress bar toward a seat limit. Editable count, goal, and label.',
  'E-Commerce', 'General', 'Dark', '', '{}', 'commerce/course-enrollment-counter.psd',
  13.1, '1.0', false, true,
  ARRAY['course','students','enrollment','education','counter'],
  '2026-03-02T10:00:00Z'
),

-- ── Analytics ─────────────────────────────────────────────────────────────────
(
  'ctr-analytics-display', 'CTR Analytics Display',
  'YouTube analytics card showing CTR and view metrics.',
  'A YouTube Studio analytics panel showing click-through rate, views, and watch time. All metrics are on separate text layers. Includes a mini sparkline chart.',
  'Analytics', 'YouTube', 'Dark', '', '{}', 'analytics/ctr-analytics-display.psd',
  15.1, '1.0', false, true,
  ARRAY['ctr','analytics','youtube','views','metrics'],
  '2026-02-08T10:00:00Z'
),
(
  'watch-time-dashboard', 'Watch Time Dashboard',
  'Total watch hours card with weekly comparison.',
  'A watch time analytics card showing total hours watched, average view duration, and week-over-week comparison. Styled like YouTube Studio analytics. All values editable.',
  'Analytics', 'YouTube', 'Dark', '', '{}', 'analytics/watch-time-dashboard.psd',
  14.7, '1.0', false, true,
  ARRAY['watch time','analytics','hours','duration','youtube'],
  '2026-03-04T10:00:00Z'
),
(
  'impressions-analytics-card', 'Impressions Analytics Card',
  'Impressions and CTR funnel visualization.',
  'A funnel-style analytics overlay showing impressions, click-through rate, and views in sequence. Styled like YouTube Studio''s impressions report. Each value is independently editable.',
  'Analytics', 'YouTube', 'Minimal', '', '{}', 'analytics/impressions-analytics-card.psd',
  12.3, '1.0', false, true,
  ARRAY['impressions','ctr','funnel','analytics','youtube'],
  '2026-03-06T10:00:00Z'
),

-- ── Challenges ────────────────────────────────────────────────────────────────
(
  '30-day-challenge-progress', '30-Day Challenge Progress',
  'Progress tracker overlay for challenge and streak videos.',
  'A challenge progress bar overlay showing day count, completion percentage, and streak. The bar fill, day number, and challenge title are all independently editable.',
  'Challenges', 'YouTube', 'Bold', '', '{}', 'challenges/30-day-challenge-progress.psd',
  10.6, '1.0', false, true,
  ARRAY['challenge','progress','streak','days','tracker'],
  '2026-02-12T10:00:00Z'
),
(
  '100-day-challenge-tracker', '100-Day Challenge Tracker',
  'Extended progress bar for 100-day challenges.',
  'A long-form challenge tracker for 100-day challenges. Includes day counter, percentage completion ring, and a minimal progress strip. Bold and readable at thumbnail size.',
  'Challenges', 'YouTube', 'Bold', '', '{}', 'challenges/100-day-challenge-tracker.psd',
  11.9, '1.0', false, true,
  ARRAY['100 days','challenge','progress','tracker','long-form'],
  '2026-03-08T10:00:00Z'
),
(
  'weekly-streak-badge', 'Weekly Streak Badge',
  'Streak badge showing consecutive weeks or days.',
  'A fire streak badge showing consecutive day or week count. Bold icon, editable count, and streak label. Great for habit videos, consistency content, and daily vlog thumbnails.',
  'Challenges', 'YouTube', 'Bold', '', '{}', 'challenges/weekly-streak-badge.psd',
  8.4, '1.0', false, true,
  ARRAY['streak','badge','weekly','habit','consistency'],
  '2026-03-10T10:00:00Z'
),

-- ── Comparisons ───────────────────────────────────────────────────────────────
(
  'best-vs-worst-comparison', 'Best vs Worst Comparison',
  'Side-by-side comparison card with ranked labels.',
  'A dual-panel comparison overlay with ranked labels and color coding. The left/right labels, score values, and background tints are all on separate layers.',
  'Comparisons', 'General', 'Bold', '', '{}', 'comparisons/best-vs-worst-comparison.psd',
  13.4, '1.0', true, true,
  ARRAY['comparison','best','worst','versus','review'],
  '2026-02-15T10:00:00Z'
),
(
  'before-after-reveal', 'Before & After Reveal',
  'Split-screen before/after reveal overlay.',
  'A clean before/after split overlay with a dividing line, labels, and optional gradient transition. Works as a half-and-half or angled split.',
  'Comparisons', 'General', 'Clean', '', '{}', 'comparisons/before-after-reveal.psd',
  11.2, '1.0', false, true,
  ARRAY['before','after','transformation','comparison','reveal'],
  '2026-02-18T10:00:00Z'
),
(
  'old-vs-new-comparison', 'Old vs New Results',
  'Time-based comparison showing old method vs new results.',
  'A timeline-style comparison showing two states: before and after a change or upgrade. Editable labels, values, and date ranges. Great for strategy, upgrade, and results videos.',
  'Comparisons', 'General', 'Dark', '', '{}', 'comparisons/old-vs-new-comparison.psd',
  12.6, '1.0', false, true,
  ARRAY['old','new','comparison','results','timeline'],
  '2026-03-12T10:00:00Z'
),

-- ── Ratings ───────────────────────────────────────────────────────────────────
(
  'five-star-rating-display', '5-Star Rating Display',
  'Review star rating overlay with score and review count.',
  'A star rating display showing rating score, filled/empty stars, and review count. All elements are fully editable.',
  'Ratings', 'General', 'Clean', '', '{}', 'ratings/five-star-rating-display.psd',
  8.9, '1.0', false, true,
  ARRAY['rating','stars','review','score','five-star'],
  '2026-02-20T10:00:00Z'
),
(
  'product-score-badge', 'Product Score Badge',
  'Circular score badge for product or course reviews.',
  'A circular score badge showing a rating out of 10 or 100 with a bold number and label. Includes a ring progress indicator. Perfect for product review and tier-list thumbnails.',
  'Ratings', 'General', 'Bold', '', '{}', 'ratings/product-score-badge.psd',
  7.8, '1.0', false, true,
  ARRAY['score','badge','product','review','rating'],
  '2026-03-01T10:00:00Z'
),
(
  'app-store-rating-card', 'App Store Rating Card',
  'App Store / Play Store styled rating and review summary.',
  'An App Store or Play Store style rating card showing star average, total reviews, and a rating breakdown bar. Editable score, review count, and app name.',
  'Ratings', 'General', 'Dark', '', '{}', 'ratings/app-store-rating-card.psd',
  13.5, '1.0', false, true,
  ARRAY['app store','rating','reviews','stars','app'],
  '2026-03-03T10:00:00Z'
),

-- ── Timers ────────────────────────────────────────────────────────────────────
(
  'launch-countdown-timer', 'Launch Countdown Timer',
  'Countdown timer overlay for launches, deadlines, and events.',
  'A digital countdown timer display showing days, hours, minutes, and seconds. The digits, label text, and color scheme are all independently editable.',
  'Timers', 'General', 'Bold', '', '{}', 'timers/launch-countdown-timer.psd',
  12.3, '1.0', false, true,
  ARRAY['countdown','timer','launch','deadline','event'],
  '2026-02-22T10:00:00Z'
),
(
  'live-event-countdown', 'Live Event Countdown',
  'Bold countdown clock for live events and premieres.',
  'A live event countdown clock with a prominent hours:minutes:seconds display and event label. Styled for stream premieres, live shows, and online events. Clean and readable at thumbnail size.',
  'Timers', 'YouTube', 'Bold', '', '{}', 'timers/live-event-countdown.psd',
  10.8, '1.0', false, true,
  ARRAY['live','event','countdown','premiere','stream'],
  '2026-03-05T10:00:00Z'
),
(
  'stream-golive-timer', 'Stream Go-Live Timer',
  'Going live countdown badge for stream announcement thumbnails.',
  'A compact going-live countdown badge with live indicator dot, time remaining, and stream label. Perfect for stream announcement thumbnails and community posts.',
  'Timers', 'YouTube', 'Dark', '', '{}', 'timers/stream-golive-timer.psd',
  9.1, '1.0', false, true,
  ARRAY['stream','live','timer','going live','announcement'],
  '2026-03-07T10:00:00Z'
),

-- ── Reactions ─────────────────────────────────────────────────────────────────
(
  'poll-result-overlay', 'Poll Result Overlay',
  'Audience poll results card with percentage bars.',
  'A YouTube Community Poll-style result card showing answer options with percentage bars and vote counts. All text and bar fill amounts are on separate layers.',
  'Reactions', 'YouTube', 'Dark', '', '{}', 'reactions/poll-result-overlay.psd',
  10.1, '1.0', false, true,
  ARRAY['poll','vote','results','percentage','community'],
  '2026-02-25T10:00:00Z'
),
(
  'reaction-bubble-overlay', 'Reaction Bubble Overlay',
  'Floating emoji reaction bubbles from the audience.',
  'A floating reaction bubble overlay showing multiple emoji reactions in a spread layout. Styled like live stream or community reactions. Emoji, count, and bubble colors are all editable.',
  'Reactions', 'YouTube', 'Bold', '', '{}', 'reactions/reaction-bubble-overlay.psd',
  9.7, '1.0', false, true,
  ARRAY['reaction','emoji','bubbles','live','community'],
  '2026-02-28T10:00:00Z'
),
(
  'community-vote-card', 'Community Vote Card',
  'Community poll card with two competing options.',
  'A head-to-head community vote card showing two options with vote percentages and a bold winner highlight. Great for debate, opinion, and community engagement thumbnails.',
  'Reactions', 'YouTube', 'Bold', '', '{}', 'reactions/community-vote-card.psd',
  11.4, '1.0', false, true,
  ARRAY['vote','community','poll','debate','opinion'],
  '2026-03-09T10:00:00Z'
),
(
  'live-chat-reactions', 'Live Chat Reactions',
  'Live stream chat messages floating overlay.',
  'A live stream-style chat bubble overlay showing several viewer messages in a stacked layout. Editable usernames, messages, and badge colors. Perfect for live stream highlight thumbnails.',
  'Reactions', 'YouTube', 'Dark', '', '{}', 'reactions/live-chat-reactions.psd',
  10.9, '1.0', false, true,
  ARRAY['chat','live','messages','stream','reactions'],
  '2026-03-11T10:00:00Z'
);
