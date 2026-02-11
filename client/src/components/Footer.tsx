export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-border mt-auto">
      <div className="gov-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Government of India</h3>
            <p className="text-xs text-muted-foreground max-w-md">
              Ministry of Electronics & Information Technology (MeitY)
              <br />
              Secure Portal for AI-Assisted Document Verification
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} National Informatics Centre. All rights reserved.
            </p>
            <div className="flex gap-4 justify-start md:justify-end mt-2 text-xs text-muted-foreground">
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span className="hover:underline cursor-pointer">Terms of Use</span>
              <span className="hover:underline cursor-pointer">Support</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border/50 text-center">
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            Restricted Access • Official Use Only • Monitoring Enabled
          </p>
        </div>
      </div>
    </footer>
  );
}
