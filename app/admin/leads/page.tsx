"use client"

import { Search, Bell, Filter, Plus, Phone, Mail, MessageSquare, Eye, Clock, Calendar, CheckCircle, CreditCard, Globe, Facebook, Footprints, UserRound, Share2, HelpCircle } from "lucide-react"

const columns = [
  {
    title: "New Leads",
    color: "bg-blue-500",
    count: 12,
    total: "$240.5k",
    cards: [
      { name: "James Wilson", vehicle: "2023 Ford F-150", time: "3 days ago", timeColor: "text-red-500", sourceIcon: Globe, actions: [Phone, Mail] },
      { name: "Linda Garcia", vehicle: "2024 Honda CR-V", time: "2 hours ago", timeColor: "text-muted-foreground", sourceIcon: Facebook, actions: [Phone, Mail] },
    ],
  },
  {
    title: "Contacted",
    color: "bg-amber-500",
    count: 8,
    total: "$185.0k",
    cards: [
      { name: "Robert Chen", vehicle: "2023 Tesla Model Y", time: "1 day ago", timeColor: "text-muted-foreground", sourceIcon: Footprints, actions: [MessageSquare, Mail] },
    ],
  },
  {
    title: "Test Drive",
    color: "bg-purple-500",
    count: 5,
    total: "$128.9k",
    cards: [
      { name: "Sarah Palmer", vehicle: "2024 BMW X5", time: "Today at 2:30 PM", timeColor: "text-muted-foreground", sourceIcon: Globe, actions: [Phone], hasAppointment: true },
    ],
  },
  {
    title: "Proposal",
    color: "bg-indigo-500",
    count: 4,
    total: "$94.2k",
    cards: [
      { name: "David Miller", vehicle: "2023 Ram 1500", time: "Sent yesterday", timeColor: "text-muted-foreground", sourceIcon: UserRound, actions: [Eye] },
    ],
  },
  {
    title: "Negotiation",
    color: "bg-emerald-500",
    count: 3,
    total: "$62.0k",
    cards: [
      { name: "Kevin Hart", vehicle: "2024 Toyota RAV4", time: "Financing Review", timeColor: "text-emerald-600", sourceIcon: Share2, actions: [], hasHighlight: true },
    ],
  },
]

export default function LeadsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Sub-header / Filters */}
      <div className="bg-card border-b border-border px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex flex-col">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 leading-none">Salesperson</label>
            <select className="text-sm font-medium border border-border bg-card rounded-lg py-1.5 pl-3 pr-8 focus:ring-primary text-foreground">
              <option>All Salespeople</option>
              <option>John Miller</option>
              <option>Sarah Jenkins</option>
              <option>Marcus Wright</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 leading-none">Lead Source</label>
            <select className="text-sm font-medium border border-border bg-card rounded-lg py-1.5 pl-3 pr-8 focus:ring-primary text-foreground">
              <option>All Sources</option>
              <option>Website</option>
              <option>Facebook</option>
              <option>Walk-in</option>
              <option>Referral</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 leading-none">Date Range</label>
            <div className="flex items-center bg-muted rounded-lg px-3 py-1.5 cursor-pointer">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground mr-2" />
              <span className="text-sm font-medium text-foreground">Last 30 Days</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-border rounded-lg text-sm font-semibold transition-colors text-foreground" type="button">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/30" type="button">
            <Plus className="h-4 w-4" />
            New Lead
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6 custom-scrollbar">
        <div className="flex gap-6 h-full min-w-max">
          {columns.map((col) => (
            <div key={col.title} className="w-[300px] flex flex-col h-full bg-muted/50 rounded-xl border border-dashed border-border p-3">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h3 className="font-bold text-foreground">{col.title}</h3>
                  <span className="bg-border text-muted-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">{col.count}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{col.total}</span>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pb-4">
                {col.cards.map((card) => (
                  <div key={card.name} className={`bg-card p-4 rounded-lg shadow-sm border border-border hover:border-primary transition-colors cursor-move group ${card.hasHighlight ? "border-l-4 border-l-emerald-500" : ""}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{card.name}</span>
                      <card.sourceIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase mb-3">
                      {card.vehicle}
                    </div>
                    {card.hasAppointment && (
                      <div className="flex items-center gap-1.5 mb-3 bg-muted p-1.5 rounded text-[10px] font-semibold text-foreground">
                        <Calendar className="h-3 w-3 text-purple-500" />
                        Today at 2:30 PM
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      <div className={`flex items-center gap-1 text-[11px] font-medium ${card.timeColor}`}>
                        {card.hasHighlight ? (
                          <><CreditCard className="h-3 w-3" />{card.time}</>
                        ) : card.hasAppointment ? (
                          <><CheckCircle className="h-3 w-3 text-emerald-500" />Confirmed</>
                        ) : (
                          <><Clock className="h-3 w-3" />{card.time}</>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {card.actions.map((ActionIcon, i) => (
                          <button key={i} type="button" className="text-muted-foreground hover:text-primary transition-colors">
                            <ActionIcon className="h-4 w-4" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button className="w-12 h-12 bg-card shadow-xl rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-all border border-border" type="button">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="w-14 h-14 bg-primary shadow-xl shadow-primary/40 rounded-full flex items-center justify-center text-primary-foreground hover:scale-110 active:scale-95 transition-all" type="button">
          <Plus className="h-7 w-7" />
        </button>
      </div>
    </div>
  )
}
