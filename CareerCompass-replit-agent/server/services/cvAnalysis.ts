import { storage } from "../storage";
import { analyzeCVWithAI, matchOpportunityWithProfile } from "./openai";
import type { InsertUser } from "@shared/schema";

export async function processCV(
  userId: number,
  cvText: string,
  fileName?: string
): Promise<void> {
  try {
    // Analyze CV with AI
    const analysis = await analyzeCVWithAI(cvText);

    // Update user with CV analysis results
    await storage.updateUser(userId, {
      cvText,
      cvFileName: fileName,
      skillsJson: analysis.skills,
      neuralProfile: {
        skills: analysis.skills,
        experience: analysis.experience,
        education: analysis.education,
        domains: analysis.domains,
        strengths: analysis.strengths,
        careerGoals: analysis.careerGoals,
        matchingKeywords: analysis.matchingKeywords,
        analyzedAt: new Date().toISOString(),
      },
    });

    // Generate opportunity matches
    await generateOpportunityMatches(userId);
  } catch (error) {
    console.error("CV Processing Error:", error);
    throw new Error("Failed to process CV: " + (error as Error).message);
  }
}

export async function generateOpportunityMatches(userId: number): Promise<void> {
  try {
    const user = await storage.getUser(userId);
    if (!user || !user.neuralProfile) {
      throw new Error("User not found or CV not analyzed");
    }

    const opportunities = await storage.getActiveOpportunities();
    
    for (const opportunity of opportunities) {
      try {
        const match = await matchOpportunityWithProfile(opportunity, user.neuralProfile);
        
        // Only create matches above a certain threshold
        if (match.matchPercentage >= 50) {
          await storage.createMatch({
            userId,
            opportunityId: opportunity.id,
            matchPercentage: match.matchPercentage.toString(),
            aiReasoning: match.reasoning,
            status: "suggested",
          });
        }
      } catch (matchError) {
        console.error(`Error matching opportunity ${opportunity.id}:`, matchError);
        // Continue with other opportunities
      }
    }
  } catch (error) {
    console.error("Opportunity Matching Error:", error);
    throw new Error("Failed to generate opportunity matches: " + (error as Error).message);
  }
}

export async function seedOpportunities(): Promise<void> {
  try {
    const existingOpportunities = await storage.getAllOpportunities();
    if (existingOpportunities.length > 0) {
      return; // Already seeded
    }

    const sampleOpportunities = [
      {
        title: "Quantum Computing Research Internship",
        organization: "IBM Quantum Network",
        type: "INTERNSHIP",
        description: "Work on cutting-edge quantum algorithms and contribute to the next generation of computing technology. You'll collaborate with world-class researchers on quantum error correction, algorithm optimization, and hardware-software integration.",
        location: "Yorktown Heights, NY",
        country: "United States",
        deadline: new Date("2025-03-15"),
        salary: "$8,000/month",
        requirements: "PhD or Master's in Physics, Computer Science, or related field. Experience with quantum computing frameworks (Qiskit, Cirq). Strong mathematical background in linear algebra and quantum mechanics.",
        skills: ["Quantum Computing", "Python", "Linear Algebra", "Physics", "Qiskit", "Research"],
        matchingCriteria: ["quantum", "physics", "research", "algorithms", "python"],
        applicationUrl: "https://ibm.com/quantum/internships",
        isActive: true,
      },
      {
        title: "AI Ethics Research Fellowship",
        organization: "Stanford HAI Institute",
        type: "FELLOWSHIP",
        description: "Shape the future of responsible AI development through interdisciplinary research. Focus on AI safety, fairness, transparency, and societal impact. Work with leading ethicists, computer scientists, and policymakers.",
        location: "Stanford, CA",
        country: "United States",
        deadline: new Date("2025-04-01"),
        salary: "$65,000/year",
        requirements: "PhD in Computer Science, Philosophy, Law, or related field. Strong background in machine learning and ethical reasoning. Published research in AI ethics or related areas.",
        skills: ["AI Ethics", "Machine Learning", "Research", "Policy", "Philosophy", "Python"],
        matchingCriteria: ["ai", "ethics", "machine learning", "research", "policy", "fairness"],
        applicationUrl: "https://hai.stanford.edu/fellowships",
        isActive: true,
      },
      {
        title: "Neural Networks Mastery Program",
        organization: "Technical University of Munich",
        type: "STUDY_ABROAD",
        description: "Master advanced neural architectures in Europe's leading AI research hub. Comprehensive program covering deep learning, computer vision, NLP, and AI applications in industry.",
        location: "Munich",
        country: "Germany",
        deadline: new Date("2025-05-20"),
        salary: "€1,200/month stipend",
        requirements: "Bachelor's in Computer Science, Mathematics, or Engineering. Strong programming skills in Python/TensorFlow/PyTorch. Academic excellence (GPA 3.5+).",
        skills: ["Deep Learning", "Neural Networks", "Python", "TensorFlow", "PyTorch", "Computer Vision"],
        matchingCriteria: ["neural networks", "deep learning", "ai", "machine learning", "python"],
        applicationUrl: "https://tum.de/ai-masters",
        isActive: true,
      },
      {
        title: "Sustainable Development Tech Grant",
        organization: "UN Technology Innovation Labs",
        type: "GRANT",
        description: "Develop technology solutions for sustainable development goals. Focus on climate change, renewable energy, smart cities, and social impact technologies.",
        location: "Remote/Global",
        country: "International",
        deadline: new Date("2025-06-30"),
        salary: "$50,000 funding",
        requirements: "Technical background in engineering, computer science, or related field. Demonstrated experience in sustainability projects. Strong project management skills.",
        skills: ["Sustainability", "IoT", "Data Science", "Project Management", "Environmental Science"],
        matchingCriteria: ["sustainability", "climate", "iot", "data science", "environmental"],
        applicationUrl: "https://un.org/tech-innovation-grants",
        isActive: true,
      },
      {
        title: "Fulbright Research Grant - AI Applications",
        organization: "Fulbright Commission",
        type: "GRANT",
        description: "Conduct independent research on AI applications in healthcare, education, or social sciences. Live and work in your chosen country for 9-12 months.",
        location: "Various Countries",
        country: "International",
        deadline: new Date("2025-03-30"),
        salary: "Full funding + living stipend",
        requirements: "US citizenship, Master's degree or equivalent, research proposal in AI applications, language proficiency for chosen country.",
        skills: ["Artificial Intelligence", "Research", "Healthcare AI", "Education Technology", "Cross-cultural Communication"],
        matchingCriteria: ["ai", "artificial intelligence", "research", "healthcare", "education"],
        applicationUrl: "https://fulbright.org/ai-research-grants",
        isActive: true,
      },
      {
        title: "Singapore Exchange Program - Smart City Tech",
        organization: "National University of Singapore",
        type: "STUDY_ABROAD",
        description: "Immerse yourself in smart city technologies and urban innovation. Study IoT, data analytics, urban planning, and sustainable city solutions in one of the world's smartest cities.",
        location: "Singapore",
        country: "Singapore",
        deadline: new Date("2025-04-15"),
        salary: "S$2,000/month stipend",
        requirements: "Undergraduate/Graduate student in Engineering, Computer Science, or Urban Studies. Strong academic record. Interest in smart city technologies.",
        skills: ["Smart Cities", "IoT", "Urban Planning", "Data Analytics", "Sustainability", "Innovation"],
        matchingCriteria: ["smart city", "iot", "urban", "data analytics", "singapore", "innovation"],
        applicationUrl: "https://nus.edu.sg/smart-city-exchange",
        isActive: true,
      }
    ];

    for (const opportunity of sampleOpportunities) {
      await storage.createOpportunity(opportunity);
    }

    console.log("Successfully seeded opportunities database");
  } catch (error) {
    console.error("Error seeding opportunities:", error);
  }
}
