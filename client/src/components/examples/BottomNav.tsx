import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import BottomNav from '../BottomNav';

export default function BottomNavExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen relative">
        <div className="p-6">
          <p className="text-muted-foreground">The navigation bar is fixed at the bottom</p>
        </div>
        <BottomNav />
      </div>
    </QueryClientProvider>
  );
}
