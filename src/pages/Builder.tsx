import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Printer, ChevronLeft, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResumeStore } from '@/store/resumeStore';
import { TEMPLATES } from '@/types/resume';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Builder = () => {
  const { selectedTemplate, setTemplate } = useResumeStore();
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('resume.pdf');
  };

  const handlePrint = () => window.print();

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg hero-gradient">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
          </Link>
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedTemplate} onValueChange={(v) => setTemplate(v as any)}>
              <SelectTrigger className="w-36 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Mobile toggle */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1 h-4 w-4" /> Print
          </Button>
          <Button size="sm" onClick={handleDownload} className="hero-gradient border-0 text-primary-foreground">
            <Download className="mr-1 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form - hidden on mobile when preview is shown */}
        <div className={`w-full overflow-y-auto border-r border-border bg-background lg:w-1/2 ${showPreview ? 'hidden lg:block' : ''}`}>
          <ResumeForm />
        </div>
        {/* Preview */}
        <div className={`w-full overflow-y-auto bg-secondary p-6 lg:w-1/2 lg:block ${showPreview ? '' : 'hidden lg:block'}`}>
          <div className="mx-auto max-w-[210mm]">
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
