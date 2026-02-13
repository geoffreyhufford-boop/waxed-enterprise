import {
  OverviewRevenueChart,
  OverviewTopSellers,
  OverviewActivityFeed,
  OverviewInventoryAlerts,
  OverviewChannelBreakdown,
  OverviewConnectedServices,
  OverviewGenreBreakdown,
  AnalyticsRevenueByChannel,
  AnalyticsMarginTrend,
  AnalyticsDaysOnShelf,
  AnalyticsDeadStock,
  AnalyticsMissedSearches,
  AnalyticsRevenueByGenre,
  AnalyticsChannelSplit,
  AnalyticsPriceVsMarket,
  AnalyticsCondition,
  AnalyticsVelocity,
  AnalyticsRestockTable,
} from '@/components/dashboard/widgets'

export interface WidgetDef {
  id: string
  label: string
  source: string
  size: 'sm' | 'lg'
  render: () => React.ReactNode
}

export const widgetRegistry: Record<string, WidgetDef> = {
  'overview-revenue-chart': {
    id: 'overview-revenue-chart',
    label: 'Revenue',
    source: 'Overview',
    size: 'lg',
    render: () => <OverviewRevenueChart />,
  },
  'overview-top-sellers': {
    id: 'overview-top-sellers',
    label: 'Top Sellers',
    source: 'Overview',
    size: 'lg',
    render: () => <OverviewTopSellers />,
  },
  'overview-activity-feed': {
    id: 'overview-activity-feed',
    label: 'Activity Feed',
    source: 'Overview',
    size: 'sm',
    render: () => <OverviewActivityFeed />,
  },
  'overview-inventory-alerts': {
    id: 'overview-inventory-alerts',
    label: 'Inventory Alerts',
    source: 'Overview',
    size: 'sm',
    render: () => <OverviewInventoryAlerts />,
  },
  'overview-channel-breakdown': {
    id: 'overview-channel-breakdown',
    label: 'Channel Breakdown',
    source: 'Overview',
    size: 'lg',
    render: () => <OverviewChannelBreakdown />,
  },
  'overview-connected-services': {
    id: 'overview-connected-services',
    label: 'Connected Services',
    source: 'Overview',
    size: 'sm',
    render: () => <OverviewConnectedServices />,
  },
  'overview-genre-breakdown': {
    id: 'overview-genre-breakdown',
    label: 'Genre Breakdown',
    source: 'Overview',
    size: 'lg',
    render: () => <OverviewGenreBreakdown />,
  },
  'analytics-revenue-by-channel': {
    id: 'analytics-revenue-by-channel',
    label: 'Revenue by Channel',
    source: 'Analytics',
    size: 'lg',
    render: () => <AnalyticsRevenueByChannel />,
  },
  'analytics-margin-trend': {
    id: 'analytics-margin-trend',
    label: 'Margin Trend',
    source: 'Analytics',
    size: 'lg',
    render: () => <AnalyticsMarginTrend />,
  },
  'analytics-days-on-shelf': {
    id: 'analytics-days-on-shelf',
    label: 'Days on Shelf',
    source: 'Analytics',
    size: 'lg',
    render: () => <AnalyticsDaysOnShelf />,
  },
  'analytics-dead-stock': {
    id: 'analytics-dead-stock',
    label: 'Dead Stock',
    source: 'Analytics',
    size: 'sm',
    render: () => <AnalyticsDeadStock />,
  },
  'analytics-missed-searches': {
    id: 'analytics-missed-searches',
    label: 'Missed Searches',
    source: 'Analytics',
    size: 'sm',
    render: () => <AnalyticsMissedSearches />,
  },
  'analytics-revenue-by-genre': {
    id: 'analytics-revenue-by-genre',
    label: 'Revenue by Genre',
    source: 'Analytics',
    size: 'sm',
    render: () => <AnalyticsRevenueByGenre />,
  },
  'analytics-channel-split': {
    id: 'analytics-channel-split',
    label: 'Channel Split',
    source: 'Analytics',
    size: 'sm',
    render: () => <AnalyticsChannelSplit />,
  },
  'analytics-price-vs-market': {
    id: 'analytics-price-vs-market',
    label: 'Price vs. Market',
    source: 'Analytics',
    size: 'lg',
    render: () => <AnalyticsPriceVsMarket />,
  },
  'analytics-condition': {
    id: 'analytics-condition',
    label: 'Condition Distribution',
    source: 'Analytics',
    size: 'sm',
    render: () => <AnalyticsCondition />,
  },
  'analytics-velocity': {
    id: 'analytics-velocity',
    label: 'Inventory Velocity',
    source: 'Analytics',
    size: 'lg',
    render: () => <AnalyticsVelocity />,
  },
  'analytics-restock-table': {
    id: 'analytics-restock-table',
    label: 'Restock Recommendations',
    source: 'Analytics',
    size: 'lg',
    render: () => <AnalyticsRestockTable />,
  },
}
