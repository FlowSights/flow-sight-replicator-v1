import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Mail, Phone, MoreVertical, Star } from "lucide-react";
import { motion } from "framer-motion";

const customers = [
  { id: 1, name: "Sarah Jenkins", email: "sarah.j@example.com", phone: "+1 (555) 123-4567", country: "🇺🇸", type: "VIP", value: "$12,400", tags: ["Honeymoon", "High Value", "Returning"], status: "Active" },
  { id: 2, name: "Familia Rodriguez", email: "familia.rodriguez@example.com", phone: "+34 600 123 456", country: "🇪🇸", type: "Regular", value: "$3,200", tags: ["Family", "Adventure"], status: "Past Guest" },
  { id: 3, name: "Marcus Schmidt", email: "m.schmidt@example.de", phone: "+49 151 2345 6789", country: "🇩🇪", type: "Lead", value: "$0", tags: ["Corporate", "Inquiry"], status: "New Lead" },
  { id: 4, name: "Elena Silva", email: "elena.s@example.com", phone: "+506 8888 9999", country: "🇨🇷", type: "VIP", value: "$5,100", tags: ["Luxury", "Wellness"], status: "Active" },
  { id: 5, name: "David Chen", email: "david.c@example.ca", phone: "+1 (416) 555-0198", country: "🇨🇦", type: "Regular", value: "$1,800", tags: ["Solo", "Surf"], status: "Past Guest" },
];

export function HubCustomers() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage your relationships and VIPs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search customers..." 
              className="pl-10 h-12 rounded-2xl bg-card/50 backdrop-blur-xl border-border/50 focus-visible:ring-primary/30 w-[300px] transition-all"
            />
          </div>
          <button className="h-12 px-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl hover:bg-muted/50 transition-colors flex items-center gap-2 font-bold text-sm">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <Card className="rounded-[32px] border border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 text-xs font-black uppercase tracking-widest text-muted-foreground">
                <th className="p-6 font-bold">Customer</th>
                <th className="p-6 font-bold hidden md:table-cell">Contact</th>
                <th className="p-6 font-bold hidden lg:table-cell">Tags</th>
                <th className="p-6 font-bold">LTV</th>
                <th className="p-6 font-bold hidden sm:table-cell">Status</th>
                <th className="p-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {customers.map((c, idx) => (
                <motion.tr 
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-muted/20 transition-colors cursor-pointer"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center font-black text-primary text-lg">
                          {c.name.charAt(0)}
                        </div>
                        {c.type === "VIP" && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-card flex items-center justify-center shadow-sm">
                            <Star className="w-3 h-3 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm flex items-center gap-2">
                          {c.name} <span className="text-lg">{c.country}</span>
                        </p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">{c.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 hidden md:table-cell">
                    <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {c.email}</span>
                      <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {c.phone}</span>
                    </div>
                  </td>
                  <td className="p-6 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-2 max-w-[200px]">
                      {c.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="bg-background/50 border-border/50 text-[10px] font-bold">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="font-bold text-sm text-emerald-500 dark:text-emerald-400">{c.value}</span>
                  </td>
                  <td className="p-6 hidden sm:table-cell">
                    <Badge variant="secondary" className="bg-muted/50 text-xs font-bold">
                      {c.status}
                    </Badge>
                  </td>
                  <td className="p-6 text-right">
                    <button className="p-2 hover:bg-muted rounded-xl transition-colors">
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
