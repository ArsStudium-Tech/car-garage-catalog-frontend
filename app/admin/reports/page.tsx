"use client"

import { Download, Calendar, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Clock } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const monthlyRevenue = [
  { month: "Jan", revenue: 1820000, units: 62 },
  { month: "Feb", revenue: 1640000, units: 56 },
  { month: "Mar", revenue: 2100000, units: 72 },
  { month: "Apr", revenue: 1950000, units: 67 },
  { month: "May", revenue: 2340000, units: 81 },
  { month: "Jun", revenue: 2480000, units: 89 },
  { month: "Jul", revenue: 2180000, units: 74 },
]

const dailyLeads = [
  { day: "Mon", leads: 12 },
  { day: "Tue", leads: 19 },
  { day: "Wed", leads: 15 },
  { day: "Thu", leads: 22 },
  { day: "Fri", leads: 28 },
  { day: "Sat", leads: 35 },
  { day: "Sun", leads: 8 },
]

const salesBySource = [
  { name: "Online Leads", value: 42 },
  { name: "Walk-in", value: 28 },
  { name: "Referrals", value: 15 },
  { name: "Phone", value: 10 },
  { name: "Events", value: 5 },
]
const PIE_COLORS = ["#1d73ed", "#10b981", "#f59e0b", "#8b5cf6", "#94a3b8"]

const topPerformers = [
  { name: "John Miller", sold: 18, revenue: "$524,200", convRate: "24%", rank: 1 },
  { name: "Sarah Jenkins", sold: 15, revenue: "$412,800", convRate: "21%", rank: 2 },
  { name: "Marcus Wright", sold: 13, revenue: "$389,100", convRate: "19%", rank: 3 },
  { name: "Emily Watson", sold: 11, revenue: "$302,400", convRate: "17%", rank: 4 },
]

const kpis = [
  { label: "Total Revenue", value: "$2.48M", change: "+8.2%", positive: true, icon: DollarSign, iconBg: "bg-emerald-50 text-emerald-600" },
  { label: "Units Sold", value: "89", change: "-2.1%", positive: false, icon: ShoppingBag, iconBg: "bg-orange-50 text-orange-600" },
  { label: "Total Leads", value: "486", change: "+12%", positive: true, icon: Users, iconBg: "bg-blue-50 text-[#1d73ed]" },
  { label: "Avg. Days to Close", value: "4.2", change: "-0.8d", positive: true, icon: Clock, iconBg: "bg-purple-50 text-purple-600" },
]

function formatCurrency(value: number) {
  return `$${(value / 1000000).toFixed(2)}M`
}

export default function ReportsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dealership Reports</h1>
          <p className="text-muted-foreground">Performance analytics for Sterling Motors</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-card border border-border rounded-lg px-4 py-2 cursor-pointer">
            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm font-medium text-foreground">July 2024</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors" type="button">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.iconBg}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${kpi.positive ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                {kpi.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">{kpi.label}</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-12 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="col-span-12 lg:col-span-8 bg-card rounded-xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Monthly Revenue</h2>
              <p className="text-sm text-muted-foreground">Revenue performance by month</p>
            </div>
            <div className="flex bg-muted p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-medium bg-card shadow-sm rounded text-foreground" type="button">Revenue</button>
              <button className="px-3 py-1 text-xs font-medium text-muted-foreground" type="button">Units</button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={formatCurrency} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: number) => [`$${(value / 1000).toFixed(0)}k`, "Revenue"]}
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                />
                <Bar dataKey="revenue" fill="#1d73ed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Source */}
        <div className="col-span-12 lg:col-span-4 bg-card rounded-xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-2">Sales by Source</h2>
          <p className="text-sm text-muted-foreground mb-4">Where your deals originate</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {salesBySource.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, ""]}
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-2">
            {salesBySource.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-12 gap-8">
        {/* Daily Leads */}
        <div className="col-span-12 lg:col-span-5 bg-card rounded-xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-2">Daily Lead Volume</h2>
          <p className="text-sm text-muted-foreground mb-6">New leads received per day (this week)</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyLeads} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d73ed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1d73ed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="leads" stroke="#1d73ed" fillOpacity={1} fill="url(#leadGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers */}
        <div className="col-span-12 lg:col-span-7 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Top Sales Performers</h2>
            <p className="text-sm text-muted-foreground">Monthly leaderboard by units sold</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Salesperson</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Units Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conv. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topPerformers.map((person) => (
                  <tr key={person.name} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${person.rank === 1 ? "bg-amber-100 text-amber-800" : person.rank === 2 ? "bg-slate-200 text-slate-600" : person.rank === 3 ? "bg-orange-100 text-orange-600" : "bg-muted text-muted-foreground"}`}>
                        {person.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">{person.name}</td>
                    <td className="px-6 py-4 text-foreground">{person.sold}</td>
                    <td className="px-6 py-4 text-foreground">{person.revenue}</td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full">{person.convRate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
