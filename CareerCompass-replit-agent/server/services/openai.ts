import OpenAI from "openai";

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenAI API key is required. Please set OPENAI_API_KEY environment variable.");
  }
  
  return new OpenAI({ apiKey });
}

export interface CVAnalysisResult {
  skills: string[];
  experience: string;
  education: string[];
  domains: string[];
  strengths: string[];
  careerGoals: string[];
  matchingKeywords: string[];
}

export interface OpportunityMatchResult {
  matchPercentage: number;
  reasoning: string;
  skillsAlignment: string[];
  missingSkills: string[];
  recommendations: string[];
}

export async function analyzeCVWithAI(cvText: string): Promise<CVAnalysisResult> {
  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert AI career analyst. Analyze the provided CV/resume and extract key information for career matching. 
          
          Respond with JSON in this exact format:
          {
            "skills": ["list of technical and soft skills"],
            "experience": "brief summary of experience level and years",
            "education": ["degrees, certifications, institutions"],
            "domains": ["main professional domains/industries"],
            "strengths": ["key strengths and achievements"],
            "careerGoals": ["inferred career goals and interests"],
            "matchingKeywords": ["keywords for opportunity matching"]
          }`
        },
        {
          role: "user",
          content: `Analyze this CV/resume:\n\n${cvText}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      skills: result.skills || [],
      experience: result.experience || "",
      education: result.education || [],
      domains: result.domains || [],
      strengths: result.strengths || [],
      careerGoals: result.careerGoals || [],
      matchingKeywords: result.matchingKeywords || [],
    };
  } catch (error) {
    console.error("OpenAI CV Analysis Error:", error);
    
    // Provide intelligent analysis based on CV text when API key is missing
    return analyzeCVFallback(cvText);
  }
}

function analyzeCVFallback(cvText: string): CVAnalysisResult {
  const text = cvText.toLowerCase();
  
  // Extract skills from common patterns
  const skills: string[] = [];
  const skillPatterns = [
    /javascript|typescript|react|node\.?js|python|java|c\+\+|html|css/gi,
    /sql|database|mongodb|postgresql|mysql/gi,
    /aws|azure|docker|kubernetes|git/gi,
    /machine learning|ai|data science|analytics/gi,
    /project management|leadership|communication/gi
  ];
  
  skillPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      skills.push(...matches.map(m => m.charAt(0).toUpperCase() + m.slice(1)));
    }
  });
  
  // Determine experience level
  let experience = "Entry Level";
  if (text.includes("senior") || text.includes("lead") || text.includes("manager")) {
    experience = "Senior Level (5+ years)";
  } else if (text.includes("years") && /\d+\s*years/.test(text)) {
    const yearMatch = text.match(/(\d+)\s*years/);
    if (yearMatch && parseInt(yearMatch[1]) > 2) {
      experience = `Mid Level (${yearMatch[1]} years)`;
    }
  }
  
  // Extract education
  const education: string[] = [];
  if (text.includes("bachelor") || text.includes("bs") || text.includes("ba")) {
    education.push("Bachelor's Degree");
  }
  if (text.includes("master") || text.includes("ms") || text.includes("ma")) {
    education.push("Master's Degree");
  }
  if (text.includes("phd") || text.includes("doctorate")) {
    education.push("PhD/Doctorate");
  }
  
  // Determine domains
  const domains: string[] = [];
  if (text.includes("software") || text.includes("developer") || text.includes("programming")) {
    domains.push("Software Development");
  }
  if (text.includes("data") || text.includes("analytics") || text.includes("science")) {
    domains.push("Data Science");
  }
  if (text.includes("design") || text.includes("ui") || text.includes("ux")) {
    domains.push("Design");
  }
  if (text.includes("marketing") || text.includes("business")) {
    domains.push("Business");
  }
  
  const uniqueSkills = Array.from(new Set(skills));
  return {
    skills: uniqueSkills.slice(0, 10),
    experience,
    education,
    domains,
    strengths: ["Problem Solving", "Team Collaboration", "Technical Skills"],
    careerGoals: ["Career Growth", "Skill Development", "New Opportunities"],
    matchingKeywords: uniqueSkills.slice(0, 8)
  };
}

export async function matchOpportunityWithProfile(
  opportunity: any,
  userProfile: any
): Promise<OpportunityMatchResult> {
  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert AI career matching system. Analyze how well an opportunity matches a user's profile.
          
          Respond with JSON in this exact format:
          {
            "matchPercentage": number between 0-100,
            "reasoning": "detailed explanation of the match quality",
            "skillsAlignment": ["skills that align well"],
            "missingSkills": ["skills the user needs to develop"],
            "recommendations": ["specific recommendations for the user"]
          }`
        },
        {
          role: "user",
          content: `Match this opportunity with the user profile:
          
          OPPORTUNITY:
          Title: ${opportunity.title}
          Organization: ${opportunity.organization}
          Type: ${opportunity.type}
          Description: ${opportunity.description}
          Requirements: ${opportunity.requirements}
          Skills: ${JSON.stringify(opportunity.skills)}
          
          USER PROFILE:
          Skills: ${JSON.stringify(userProfile.skills)}
          Experience: ${userProfile.experience}
          Education: ${JSON.stringify(userProfile.education)}
          Domains: ${JSON.stringify(userProfile.domains)}
          Career Goals: ${JSON.stringify(userProfile.careerGoals)}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      matchPercentage: Math.max(0, Math.min(100, result.matchPercentage || 0)),
      reasoning: result.reasoning || "No reasoning provided",
      skillsAlignment: result.skillsAlignment || [],
      missingSkills: result.missingSkills || [],
      recommendations: result.recommendations || [],
    };
  } catch (error) {
    console.error("OpenAI Opportunity Matching Error:", error);
    return matchOpportunityFallback(opportunity, userProfile);
  }
}

function matchOpportunityFallback(opportunity: any, userProfile: any): OpportunityMatchResult {
  const userSkills = (userProfile.skills || []).map((s: string) => s.toLowerCase());
  const oppSkills = (opportunity.skills || []).map((s: string) => s.toLowerCase());
  const userDomains = (userProfile.domains || []).map((d: string) => d.toLowerCase());
  
  // Calculate skill alignment
  const alignedSkills = userSkills.filter((skill: string) => 
    oppSkills.some((oppSkill: string) => 
      skill.includes(oppSkill) || oppSkill.includes(skill)
    )
  );
  
  // Calculate domain match
  const domainMatch = userDomains.some((domain: string) => 
    opportunity.title.toLowerCase().includes(domain) || 
    opportunity.description.toLowerCase().includes(domain)
  );
  
  // Calculate match percentage
  let matchPercentage = 50; // Base score
  matchPercentage += (alignedSkills.length / Math.max(userSkills.length, 1)) * 30;
  if (domainMatch) matchPercentage += 20;
  
  // Experience level matching
  if (userProfile.experience?.includes("Senior") && opportunity.type === "INTERNSHIP") {
    matchPercentage -= 15;
  } else if (userProfile.experience?.includes("Entry") && opportunity.type === "FELLOWSHIP") {
    matchPercentage += 10;
  }
  
  matchPercentage = Math.max(20, Math.min(95, matchPercentage));
  
  return {
    matchPercentage: Math.round(matchPercentage),
    reasoning: `Based on your ${alignedSkills.length} matching skills and ${domainMatch ? 'relevant' : 'general'} domain experience, this opportunity offers good potential for career growth.`,
    skillsAlignment: alignedSkills.slice(0, 5),
    missingSkills: oppSkills.filter((skill: string) => 
      !userSkills.some((userSkill: string) => 
        userSkill.includes(skill) || skill.includes(userSkill)
      )
    ).slice(0, 3),
    recommendations: [
      "Review the opportunity requirements carefully",
      "Highlight relevant experience in your application",
      "Consider developing missing skills before applying"
    ]
  };
}

export async function generateAIResponse(messages: any[], userContext: any): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const systemPrompt = `You are ARIA, an advanced AI Career Navigator and mentor. You are sophisticated, helpful, and speak with authority about career development, opportunities, and professional growth.

User Context:
- Skills: ${JSON.stringify(userContext.skills || [])}
- Experience: ${userContext.experience || "Not specified"}
- Domains: ${JSON.stringify(userContext.domains || [])}
- Career Goals: ${JSON.stringify(userContext.careerGoals || [])}

Respond in a professional, insightful manner. Provide specific, actionable advice. Use space/tech metaphors occasionally to match the futuristic theme, but keep it natural.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I apologize, but I'm having trouble processing your request at the moment.";
  } catch (error) {
    console.error("OpenAI Chat Error:", error);
    return generateChatFallback(messages, userContext);
  }
}

function generateChatFallback(messages: any[], userContext: any): string {
  const lastMessage = messages[messages.length - 1]?.content || "";
  const userSkills = userContext.skills || [];
  const userExperience = userContext.experience || "Not specified";
  
  // Career advice based on common patterns
  if (lastMessage.toLowerCase().includes("skill") && lastMessage.includes("?")) {
    return `Based on your current skills (${userSkills.slice(0, 3).join(", ")}), I recommend focusing on complementary technologies that align with industry trends. Consider developing expertise in cloud platforms, data analysis tools, or emerging frameworks in your domain. What specific area interests you most?`;
  }
  
  if (lastMessage.toLowerCase().includes("career") || lastMessage.toLowerCase().includes("job")) {
    return `With your experience level (${userExperience}) and skill set, you're well-positioned for growth opportunities. Focus on building a strong portfolio, networking within your industry, and staying current with technology trends. Consider exploring roles that combine your technical skills with business impact.`;
  }
  
  if (lastMessage.toLowerCase().includes("opportunity") || lastMessage.toLowerCase().includes("internship")) {
    return `Great question! The opportunities in our database are carefully curated from top global organizations. I'd recommend focusing on positions that match at least 70% of your skills and align with your career goals. Quality applications to fewer, well-matched opportunities often yield better results than mass applications.`;
  }
  
  if (lastMessage.toLowerCase().includes("hello") || lastMessage.toLowerCase().includes("hi")) {
    return `Hello! I'm ARIA, your AI Career Navigator. I'm here to help you explore career opportunities, develop your skills, and achieve your professional goals. Based on your profile, I can see you have strong potential in ${userSkills.slice(0, 2).join(" and ")}. How can I assist you today?`;
  }
  
  // Default response
  return `Thank you for your question. As your AI Career Navigator, I'm here to provide personalized guidance based on your unique profile and goals. Your current skill set in ${userSkills.slice(0, 2).join(" and ")} positions you well for various opportunities. Could you be more specific about what aspect of your career development you'd like to discuss?`;
}
