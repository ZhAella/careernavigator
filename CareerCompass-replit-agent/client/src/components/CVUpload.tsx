import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

const userSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  domain: z.string().optional(),
  experienceLevel: z.string().optional(),
});

type UserForm = z.infer<typeof userSchema>;

interface CVUploadProps {
  onUserCreated?: (user: any) => void;
}

export default function CVUpload({ onUserCreated }: CVUploadProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      email: "",
      domain: "",
      experienceLevel: "",
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} is ready for analysis`,
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const onSubmit = async (data: UserForm) => {
    try {
      setIsProcessing(true);
      setProcessingStep("Creating neural profile...");

      // Create user
      const userResponse = await apiRequest("POST", "/api/users", data);
      const user = await userResponse.json();
      
      if (uploadedFile) {
        setProcessingStep("Analyzing neural patterns...");
        
        // Upload and process CV
        const formData = new FormData();
        formData.append("cv", uploadedFile);
        
        const cvResponse = await fetch(`/api/users/${user.id}/cv`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!cvResponse.ok) {
          throw new Error("CV processing failed");
        }

        setProcessingStep("Generating opportunity matches...");
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      } else {
        // Quick neural scan without CV
        await apiRequest("POST", `/api/users/${user.id}/neural-scan`, {
          domain: data.domain,
          experienceLevel: data.experienceLevel,
        });
      }

      setProcessingStep("Neural profile complete!");
      
      toast({
        title: "Neural profile created",
        description: "Your AI career analysis is ready",
      });

      onUserCreated?.(user);
      setLocation(`/dashboard/${user.id}`);
      
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to process your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  if (isProcessing) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass-panel border-neon">
          <CardContent className="p-12 text-center">
            <div className="progress-ring mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-neon-blue mb-4">AI Processing...</h3>
            <p className="text-plasma-green text-lg mb-4">{processingStep}</p>
            <p className="text-cyber-gray">
              Our quantum algorithms are analyzing your neural patterns and mapping career trajectories
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* CV Upload */}
        <Card className="glass-panel border-neon">
          <CardHeader>
            <CardTitle className="text-neon-blue flex items-center">
              <Upload className="mr-2" />
              Upload Your Neural Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`file-upload-zone rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? "drag-over" : ""
              }`}
            >
              <input {...getInputProps()} />
              <div className="mb-6">
                {uploadedFile ? (
                  <CheckCircle className="h-16 w-16 text-plasma-green mx-auto mb-4" />
                ) : (
                  <FileText className="h-16 w-16 text-neon-blue mx-auto mb-4" />
                )}
                
                {uploadedFile ? (
                  <>
                    <p className="text-xl mb-2 text-plasma-green font-semibold">
                      {uploadedFile.name}
                    </p>
                    <p className="text-cyber-gray">Neural profile ready for analysis</p>
                  </>
                ) : (
                  <>
                    <p className="text-xl mb-2 text-white">
                      {isDragActive ? "Drop your neural profile here" : "Drag and drop your CV here"}
                    </p>
                    <p className="text-cyber-gray">PDF, DOC, DOCX up to 10MB</p>
                  </>
                )}
              </div>
              
              {!uploadedFile && (
                <Button className="cyber-button">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Neural Scan Form */}
        <Card className="glass-panel border-neon">
          <CardHeader>
            <CardTitle className="text-plasma-green flex items-center">
              <FileText className="mr-2" />
              Quick Neural Scan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="fullName" className="text-cyber-gray">Full Name</Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  className="form-input"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-cyber-gray">Neural Link (Email)</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="form-input"
                  placeholder="your.email@domain.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="domain" className="text-cyber-gray">Select Your Domain</Label>
                <Select onValueChange={(value) => setValue("domain", value)}>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Choose your primary domain" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-neon-blue">
                    <SelectItem value="technology">Technology & AI</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="business">Business Strategy</SelectItem>
                    <SelectItem value="design">Design & UX</SelectItem>
                    <SelectItem value="research">Research & Academia</SelectItem>
                    <SelectItem value="healthcare">Healthcare & Biotech</SelectItem>
                    <SelectItem value="finance">Finance & Economics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experienceLevel" className="text-cyber-gray">Experience Level</Label>
                <Select onValueChange={(value) => setValue("experienceLevel", value)}>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-neon-blue">
                    <SelectItem value="initiate">Neural Initiate (0-2 years)</SelectItem>
                    <SelectItem value="practitioner">Quantum Practitioner (3-5 years)</SelectItem>
                    <SelectItem value="expert">Cosmic Expert (5+ years)</SelectItem>
                    <SelectItem value="master">Galactic Master (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="cyber-button w-full py-3 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing Neural Analysis...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Begin Neural Scan
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
