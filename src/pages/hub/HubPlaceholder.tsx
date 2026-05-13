import { Card } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export function HubPlaceholder({ title }: { title: string }) {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-700">
      <Card className="p-12 rounded-[32px] border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center max-w-md">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
          <Wrench className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-black mb-3">{title}</h2>
        <p className="text-muted-foreground font-medium leading-relaxed">
          This premium operational module is currently under development. It will provide unparalleled control and AI-driven insights for your business.
        </p>
      </Card>
    </div>
  );
}
