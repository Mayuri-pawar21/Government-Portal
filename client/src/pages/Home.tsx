import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MetricCard } from "@/components/MetricCard";
import { useVerifications } from "@/hooks/use-verifications";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ShieldCheck, 
  Search, 
  FileWarning, 
  Activity,
  ArrowRight,
  Database
} from "lucide-react";
import { format } from "date-fns";

export default function Home() {
  const { data: verifications, isLoading } = useVerifications();

  const totalVerifications = verifications?.length || 0;
  const flaggedCases = verifications?.filter(v => v.authenticityStatus !== "Likely Genuine").length || 0;
  const highRiskCases = verifications?.filter(v => v.riskLevel === "High").length || 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-white rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute left-0 bottom-0 h-[300px] w-[300px] bg-white rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />
          </div>

          <div className="gov-container relative z-10">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-4 text-primary-foreground border-primary-foreground/30 bg-primary-foreground/10">
                Authorized Personnel Only
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                AI-Powered Document <br/>Forensics Portal
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-xl">
                Advanced image forgery detection system for government welfare schemes. 
                Verify applicant documents with 99.8% accuracy using deep learning analysis.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/verify">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold h-12 px-8 shadow-lg shadow-black/20">
                    <Search className="mr-2 h-5 w-5" />
                    Start Verification
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="gov-container -mt-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              title="Total Verifications" 
              value={isLoading ? "..." : totalVerifications} 
              description="Processed this session"
              icon={<Database className="h-5 w-5" />}
              trend="up"
              trendValue="+12%"
            />
            <MetricCard 
              title="Flagged Documents" 
              value={isLoading ? "..." : flaggedCases} 
              description="Requires manual review"
              icon={<FileWarning className="h-5 w-5 text-yellow-600" />}
              trend="down"
              trendValue="-2.5%"
              className="border-l-4 border-l-yellow-500"
            />
            <MetricCard 
              title="High Risk Alerts" 
              value={isLoading ? "..." : highRiskCases} 
              description="Immediate action needed"
              icon={<ShieldCheck className="h-5 w-5 text-red-600" />}
              className="border-l-4 border-l-red-600"
            />
          </div>
        </div>

        <div className="gov-container py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">Recent Activity</h2>
              <p className="text-slate-500">Real-time log of verification requests.</p>
            </div>
            <Link href="/verify">
              <Button variant="outline" className="hidden sm:flex">
                New Verification <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-900">Reference ID</TableHead>
                  <TableHead className="font-semibold text-slate-900">Scheme</TableHead>
                  <TableHead className="font-semibold text-slate-900">Date & Time</TableHead>
                  <TableHead className="font-semibold text-slate-900">Status</TableHead>
                  <TableHead className="font-semibold text-slate-900">Confidence</TableHead>
                  <TableHead className="text-right font-semibold text-slate-900">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : verifications && verifications.length > 0 ? (
                  verifications.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-mono text-xs font-medium">{item.referenceNumber || "N/A"}</TableCell>
                      <TableCell>{item.welfareScheme}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {item.createdAt ? format(new Date(item.createdAt), "MMM d, HH:mm") : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${item.authenticityStatus === "Likely Genuine" ? "text-green-700 border-green-200 bg-green-50" : "text-red-700 border-red-200 bg-red-50"}
                          `}
                        >
                          {item.authenticityStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${item.confidenceScore > 80 ? "bg-green-500" : "bg-yellow-500"}`}
                              style={{ width: `${item.confidenceScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{item.confidenceScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/result/${item.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 text-primary hover:text-primary hover:bg-primary/10">
                            View Report
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Activity className="h-8 w-8 text-slate-300" />
                        <p>No verification records found.</p>
                        <Link href="/verify">
                          <Button variant="link" size="sm">Start your first verification</Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
