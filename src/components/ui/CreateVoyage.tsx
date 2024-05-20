import { useState } from "react";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "~/components/ui/sheet";
import { useToast } from "~/components/ui/use-toast";
import CreateVoyageForm from "~/components/ui/CreateVoyageForm";

export default function CreateVoyage() {
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();
    const { toast } = useToast();
    const mutation = useMutation({
        onSuccess: async () => {
          await queryClient.invalidateQueries([
            "voyages",
          ] as InvalidateQueryFilters);
          toast({ title: "Voyage deleted successfully", status: "success" });
        },
      });

      const handleCreateSuccess = () => {
        setOpen(false);
        toast({ title: "Voyage created successfully", status: "success" });
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      return (
        <>
            <div className="mb-4 flex justify-between">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline">Create</Button>
                </SheetTrigger>
                <SheetContent>
                  <CreateVoyageForm
                    onSuccess={handleCreateSuccess}
                    onClose={handleClose}
                  />
                </SheetContent>
              </Sheet>
            </div>
        </> 
    )
}
