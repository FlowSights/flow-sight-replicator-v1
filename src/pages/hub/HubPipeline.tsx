import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Calendar, DollarSign, GripVertical } from "lucide-react";
import { motion } from "framer-motion";

const stages = [
  { id: "new", name: "New Inquiry", color: "bg-blue-500", items: [
    { id: 1, customer: "Sarah Jenkins", service: "Luxury Honeymoon", value: "$4,500", date: "Oct 15", source: "Instagram", urgency: "High" },
    { id: 2, customer: "Mike Ross", service: "Volcano Tour", value: "$350", date: "Oct 18", source: "Website", urgency: "Medium" }
  ]},
  { id: "contacted", name: "Contacted", color: "bg-amber-500", items: [
    { id: 3, customer: "Elena Silva", service: "Catamaran Private", value: "$1,200", date: "Oct 12", source: "Referral", urgency: "High" }
  ]},
  { id: "quoted", name: "Quoted", color: "bg-purple-500", items: [
    { id: 4, customer: "David Chen", service: "Surf Retreat", value: "$2,800", date: "Nov 01", source: "Google Ads", urgency: "Medium" },
    { id: 5, customer: "Emma Watson", service: "Airport Shuttle", value: "$150", date: "Oct 10", source: "Website", urgency: "Low" }
  ]},
  { id: "confirmed", name: "Confirmed", color: "bg-emerald-500", items: [
    { id: 6, customer: "Family Thompson", service: "Custom Itinerary", value: "$8,900", date: "Dec 15", source: "Direct", urgency: "Low" }
  ]}
];

const urgencyColors: Record<string, string> = {
  High: "text-red-500 bg-red-500/10 border-red-500/20",
  Medium: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  Low: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
};

export function HubPipeline() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Booking Pipeline</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage leads and conversions.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          <Plus className="w-5 h-5" /> New Booking
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="flex gap-6 h-full min-w-max px-2">
          {stages.map((stage, stageIdx) => (
            <div key={stage.id} className="w-[320px] flex flex-col max-h-full">
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <h3 className="font-bold text-sm">{stage.name}</h3>
                  <Badge variant="secondary" className="ml-2 text-xs font-bold bg-muted/50">{stage.items.length}</Badge>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Kanban Column */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none pb-20">
                {stage.items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (stageIdx * 0.1) + (idx * 0.05) }}
                  >
                    <Card className="p-4 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/80 mt-0.5 transition-colors" />
                          <div>
                            <p className="font-bold text-sm text-foreground">{item.customer}</p>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5">{item.service}</p>
                          </div>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold shrink-0">
                          {item.customer.charAt(0)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted/50 border border-border flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-emerald-500" /> {item.value}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted/50 border border-border flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-blue-500" /> {item.date}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-border/50">
                        <span className="text-[10px] font-medium text-muted-foreground px-2 py-1 rounded bg-card">{item.source}</span>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${urgencyColors[item.urgency]}`}>
                          {item.urgency}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                
                {/* Add Card Button */}
                <button className="w-full py-3 rounded-2xl border-2 border-dashed border-border/50 text-muted-foreground text-sm font-bold hover:bg-muted/30 hover:text-foreground hover:border-border transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Lead
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
