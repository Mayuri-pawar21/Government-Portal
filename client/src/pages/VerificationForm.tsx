import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCreateVerification } from "@/hooks/use-verifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, Loader2, FileCheck, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function VerificationForm() {
  const { mutate, isPending } = useCreateVerification();
  const { toast } = useToast();
  
  const [referenceNumber, setReferenceNumber] = useState("");
  const [welfareScheme, setWelfareScheme] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Basic client-side validation
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referenceNumber || !welfareScheme || !file) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and upload an image.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("referenceNumber", referenceNumber);
    formData.append("welfareScheme", welfareScheme);
    formData.append("image", file);

    mutate(formData, {
      onError: (error) => {
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 gov-container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-serif font-bold text-slate-900">New Verification Request</h1>
            <p className="text-slate-500 mt-2">Submit a document for AI-powered forgery analysis. Results are generated instantly.</p>
          </div>

          <Card className="border-t-4 border-t-primary shadow-md">
            <CardHeader className="bg-white border-b border-slate-100">
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Case Details
              </CardTitle>
              <CardDescription>
                Enter the official reference details for this document.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid gap-2">
                  <Label htmlFor="referenceNumber" className="font-semibold text-slate-700">Reference Number / Application ID</Label>
                  <Input
                    id="referenceNumber"
                    placeholder="e.g. PMK-2024-88392"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="h-12 border-slate-300 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="welfareScheme" className="font-semibold text-slate-700">Welfare Scheme / Department</Label>
                  <Select value={welfareScheme} onValueChange={setWelfareScheme}>
                    <SelectTrigger id="welfareScheme" className="h-12 border-slate-300 focus:border-primary focus:ring-primary/20">
                      <SelectValue placeholder="Select scheme..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PM Kisan Yojana">PM Kisan Samman Nidhi</SelectItem>
                      <SelectItem value="Farmer Relief Fund">National Farmer Relief Fund</SelectItem>
                      <SelectItem value="Ayushman Bharat">Ayushman Bharat (Health)</SelectItem>
                      <SelectItem value="Housing Scheme">PMAY (Housing)</SelectItem>
                      <SelectItem value="Other">Other / General Verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image" className="font-semibold text-slate-700">Document Image</Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      id="image" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-sm font-medium text-slate-900">
                        {file ? file.name : "Click to upload or drag and drop"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {file ? `${(file.size / 1024).toFixed(2)} KB` : "JPG, PNG supported (Max 5MB)"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Link href="/">
                    <Button type="button" variant="ghost" className="text-slate-500">Cancel</Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="bg-primary hover:bg-primary/90 text-white min-w-[150px] h-12 text-base font-medium shadow-md"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="mr-2 h-5 w-5" />
                        Run Verification
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
          
          <p className="text-center text-xs text-slate-400 mt-8">
            Secure Submission Protocol v2.4 • All actions are logged
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
