import { Car, BarChart3, Tag, DollarSign, UserPlus, ShoppingBag, Pencil, Mail } from "lucide-react"

const stats = [
  { label: "Active Inventory", value: "142", change: "+4%", positive: true, icon: Car, iconBg: "bg-blue-50 text-[#1d73ed]" },
  { label: "Leads This Month", value: "486", change: "+12%", positive: true, icon: BarChart3, iconBg: "bg-purple-50 text-purple-600" },
  { label: "Units Sold", value: "89", change: "-2%", positive: false, icon: Tag, iconBg: "bg-orange-50 text-orange-600" },
  { label: "Total Revenue", value: "$2.48M", change: "+8.2%", positive: true, icon: DollarSign, iconBg: "bg-emerald-50 text-emerald-600" },
]

const funnelData = [
  { label: "Total Leads", count: 486, pct: 100 },
  { label: "Showroom Visits", count: 214, pct: 44 },
  { label: "Sent Proposals", count: 132, pct: 27.1 },
  { label: "Closed Deals", count: 89, pct: 18.3 },
]

const activities = [
  { icon: UserPlus, iconBg: "bg-blue-100 text-[#1d73ed]", title: "New Lead:", name: "Sarah Johnson", detail: "Interested in 2023 Audi Q5", time: "2 mins ago" },
  { icon: ShoppingBag, iconBg: "bg-emerald-100 text-emerald-600", title: "Deal Closed:", name: "Michael Chen", detail: "Sold 2021 BMW M4 - $64,500", time: "45 mins ago" },
  { icon: Pencil, iconBg: "bg-orange-100 text-orange-600", title: "Inventory Update", name: "", detail: "Price reduction: 2019 Tesla Model 3", time: "2 hours ago" },
  { icon: Mail, iconBg: "bg-slate-100 text-slate-500", title: "Message Received", name: "", detail: "From: David Rossi re: Finance Options", time: "4 hours ago" },
  { icon: UserPlus, iconBg: "bg-blue-100 text-[#1d73ed]", title: "New Lead:", name: "Emily Watson", detail: "Interested in 2024 Land Rover Defender", time: "5 hours ago" },
]

const inventoryBars = [
  { label: "SUV", count: 42, height: "60%" },
  { label: "Sedan", count: 64, height: "85%" },
  { label: "Truck", count: 31, height: "45%" },
  { label: "Sports", count: 5, height: "15%" },
]

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dealership Overview</h1>
        <p className="text-muted-foreground">{"Performance insights for Sterling Motors \u2022 July 2024"}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.positive ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Sales Funnel */}
        <div className="col-span-12 lg:col-span-8 bg-card p-8 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-lg font-bold text-foreground">Sales Conversion Funnel</h2>
              <p className="text-sm text-muted-foreground">Lead progression performance this month</p>
            </div>
            <div className="flex bg-muted p-1 rounded-lg">
              <button className="px-3 py-1 text-xs font-medium bg-card shadow-sm rounded text-foreground" type="button">30 Days</button>
              <button className="px-3 py-1 text-xs font-medium text-muted-foreground" type="button">90 Days</button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {funnelData.map((item, i) => (
              <div key={item.label} className="flex flex-col gap-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted-foreground">{item.count}</span>
                </div>
                <div className="h-10 bg-muted rounded-lg overflow-hidden flex">
                  <div
                    className="h-full bg-primary flex items-center px-4 text-primary-foreground text-xs font-bold rounded-lg transition-all"
                    style={{ width: `${item.pct}%`, opacity: 1 - i * 0.2 }}
                  >
                    {item.pct}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-border grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">12.4%</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Avg. Close Rate</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-2xl font-bold text-primary">4.2d</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Avg. Time to Close</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">$27.8k</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Avg. Transaction</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
              <button className="text-primary text-sm font-medium hover:underline" type="button">View All</button>
            </div>
            <div className="flex flex-col gap-6 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {activities.map((act, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${act.iconBg}`}>
                    <act.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      <span className="font-bold">{act.title}</span> {act.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{act.detail}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Inventory Distribution */}
        <div className="xl:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Inventory Distribution</h2>
            <span className="text-xs text-muted-foreground">Total: 142 Units</span>
          </div>
          <div className="flex items-end gap-2 h-48 pt-4">
            {inventoryBars.map((bar) => (
              <div key={bar.label} className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-lg relative group transition-all" style={{ height: bar.height }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-card text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {bar.count} {bar.label}s
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
            {inventoryBars.map((bar) => (
              <span key={bar.label} className="flex-1 text-center">{bar.label}</span>
            ))}
          </div>
        </div>

        {/* Goal Progress */}
        <div className="bg-primary p-6 rounded-xl text-primary-foreground shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold">Goal Progress</h2>
            <p className="text-primary-foreground/70 text-sm mt-1">July Target: 120 Sales</p>
          </div>
          <div className="my-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-bold">74%</span>
              <span className="text-sm font-medium text-primary-foreground/80">89 of 120 sold</span>
            </div>
            <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary-foreground rounded-full" style={{ width: "74%" }} />
            </div>
          </div>
          <button className="w-full bg-primary-foreground/10 hover:bg-primary-foreground/20 border border-primary-foreground/30 py-2.5 rounded-lg text-sm font-semibold transition-all backdrop-blur-sm" type="button">
            Analyze Team Productivity
          </button>
        </div>
      </div>
    </div>
  )
}
