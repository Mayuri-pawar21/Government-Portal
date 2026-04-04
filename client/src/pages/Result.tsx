import { useParams, Link } from "wouter";
import { useVerification } from "@/hooks/use-verifications";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertTriangle, 
  FileText, 
  ArrowLeft,
  Printer
} from "lucide-react";
import { format } from "date-fns";

export default function Result() {
  const params = useParams();
  const id = Number(params.id);
  const { data: verification, isLoading, isError } = useVerification(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 gov-container py-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !verification) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 gov-container py-12 flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md bg-white shadow-lg">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Fetching Result</AlertTitle>
            <AlertDescription>
              The requested verification record could not be found or an error occurred.
              <div className="mt-4">
                <Link href="/">
                  <Button variant="outline" size="sm">Return to Dashboard</Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  const isGenuine = verification.authenticityStatus === "Likely Genuine";
  const isHighRisk = verification.riskLevel === "High";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 gov-container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb / Navigation */}
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Print Report
              </Button>
            </div>
          </div>

          {/* Main Status Card */}
          <div className="grid gap-6">
            <Card className="border-t-4 border-t-primary shadow-md overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 pb-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-serif text-slate-900">Verification Report</CardTitle>
                    <CardDescription className="text-slate-500 flex items-center gap-2">
                      Reference #{verification.referenceNumber} • {format(new Date(verification.createdAt || ""), "PPP p")}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={isGenuine ? "default" : "destructive"} 
                    className={`text-sm px-4 py-1.5 capitalize ${
                      isGenuine ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {verification.authenticityStatus}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-8 bg-slate-50/50">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Analysis Metrics */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">AI Analysis Metrics</h4>
                      
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-700">Confidence Score</span>
                            <span className="text-lg font-bold text-primary">{verification.confidenceScore}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                verification.confidenceScore > 80 ? "bg-green-500" : 
                                verification.confidenceScore > 50 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${verification.confidenceScore}%` }}
                            />
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium text-slate-700 block">Risk Assessment</span>
                            <span className="text-xs text-muted-foreground">Based on pixel analysis & metadata</span>
                          </div>
                          <Badge variant={isHighRisk ? "destructive" : "secondary"} className="ml-2">
                            {verification.riskLevel} Risk
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Document Details</h4>
                      <dl className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
                        <div className="px-4 py-3 grid grid-cols-2">
                          <dt className="text-sm font-medium text-slate-500">Scheme</dt>
                          <dd className="text-sm font-semibold text-slate-900">{verification.welfareScheme}</dd>
                        </div>
                        <div className="px-4 py-3 grid grid-cols-2">
                          <dt className="text-sm font-medium text-slate-500">File Name</dt>
                          <dd className="text-sm text-slate-900 truncate" title={verification.fileName}>{verification.fileName}</dd>
                        </div>
                        <div className="px-4 py-3 grid grid-cols-2">
                          <dt className="text-sm font-medium text-slate-500">File Size</dt>
                          <dd className="text-sm text-slate-900">{(verification.fileSize / 1024).toFixed(2)} KB</dd>
                        </div>
                        <div className="px-4 py-3 grid grid-cols-2">
                          <dt className="text-sm font-medium text-slate-500">MIME Type</dt>
                          <dd className="text-sm text-slate-900">{verification.mimeType}</dd>
                        </div>
                      </dl>
                    </div>

                    {(verification.forgeryParameters as string[])?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3">Detected Anomalies</h4>
                        <ul className="bg-red-50 rounded-lg border border-red-100 divide-y divide-red-200/50">
                          {(verification.forgeryParameters as string[]).map((param, index) => (
                            <li key={index} className="px-4 py-2 text-sm text-red-700 font-medium flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3" />
                              {param}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Visual Analysis Placeholder */}
                  <div className="space-y-4">
                     <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Visual Evidence</h4>
                     <div className="aspect-[4/3] bg-slate-200 rounded-lg border border-slate-300 flex items-center justify-center relative overflow-hidden group">
                        {/* In a real app, we would serve the uploaded image back here.
                            Since we don't have file storage serving implemented in this specific prompt context,
                            we use a placeholder state. */}
                        <div className="text-center p-6">
                           <FileText className="h-16 w-16 text-slate-400 mx-auto mb-3" />
                           <p className="text-sm text-slate-500 font-medium">Source Document Preview</p>
                           <p className="text-xs text-slate-400 mt-1">Image data processed securely</p>
                        </div>
                        
                        {/* Overlay indicating analysis areas */}
                        {!isGenuine && (
                          <div className="absolute inset-0 bg-red-500/10 border-4 border-red-500/50 flex items-center justify-center">
                            <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold shadow-sm animate-pulse">
                              ANOMALY DETECTED
                            </span>
                          </div>
                        )}
                     </div>
                     <div className="text-xs text-slate-500 italic border-l-2 border-primary/20 pl-3">
                       Analysis completed using ensemble CNN models for pixel manipulation and metadata consistency checks.
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Alert className="bg-yellow-50 border-yellow-200 text-yellow-900">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800 font-semibold">Legal Disclaimer</AlertTitle>
              <AlertDescription className="text-yellow-800/90 text-sm">
                This AI-based assessment is probabilistic and intended solely to assist government authorities. 
                Final verification, approval, or rejection decisions must be made manually by authorized officials.
                Automated results should not be the sole basis for legal action.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end gap-3 mt-4">
              <Link href="/verify">
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                  Perform Another Verification
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
