import { cn } from "@/lib/utils";
import { Command } from "lucide-react";

const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <div className="flex items-center gap-2">
        <Command className={cn("h-8 w-8 text-primary", className)} {...props} />
        <span className="text-2xl font-bold font-headline text-foreground">TaskMaster</span>
    </div>

  );
};

export default Logo;
