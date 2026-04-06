import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  ExternalLink, Sparkles, BookOpen, Users, 
  Search, ArrowRight, Copy, RefreshCw, 
  Star, Clock, Zap 
} from 'lucide-react';
import { cn } from './utils/cn';

interface AnalysisResult {
  classification: string;
  priority: number;
  labels: string[];
  similarIssues: Array<{
    title: string;
    repo: string;
    similarity: number;
  }>;
  explanation: string;
}

interface RecommendedIssue {
  id: number;
  title: string;
  repo: string;
  url: string;
  labels: string[];
  difficulty: string;
  matchScore: number;
  languages: string[];
  explanation: string;
  stars: number;
}

const mockIssues: RecommendedIssue[] = [
  {
    id: 1,
    title: "Add dark mode support to the UI",
    repo: "facebook/react",
    url: "https://github.com/facebook/react/issues/1234",
    labels: ["enhancement", "good first issue"],
    difficulty: "Medium",
    matchScore: 92,
    languages: ["TypeScript", "JavaScript"],
    explanation: "Matches your React and TypeScript skills. Popular repo with many contributors.",
    stars: 23000
  },
  {
    id: 2,
    title: "Fix memory leak in the data processor",
    repo: "vercel/next.js",
    url: "https://github.com/vercel/next.js/issues/5678",
    labels: ["bug", "help wanted"],
    difficulty: "Hard",
    matchScore: 78,
    languages: ["JavaScript"],
    explanation: "High impact bug that requires debugging experience.",
    stars: 124000
  },
  {
    id: 3,
    title: "Implement new documentation for API endpoints",
    repo: "axios/axios",
    url: "https://github.com/axios/axios/issues/4321",
    labels: ["documentation"],
    difficulty: "Easy",
    matchScore: 85,
    languages: ["JavaScript", "TypeScript"],
    explanation: "Perfect for beginners. Documentation improvements always needed.",
    stars: 104000
  },
  {
    id: 4,
    title: "Add support for Python 3.12",
    repo: "pandas-dev/pandas",
    url: "https://github.com/pandas-dev/pandas/issues/8901",
    labels: ["bug", "good first issue"],
    difficulty: "Medium",
    matchScore: 65,
    languages: ["Python"],
    explanation: "If you know Python, this is a great way to contribute to data science tools.",
    stars: 43000
  },
  {
    id: 5,
    title: "Create Rust bindings for the core library",
    repo: "tauri-apps/tauri",
    url: "https://github.com/tauri-apps/tauri/issues/6543",
    labels: ["enhancement"],
    difficulty: "Hard",
    matchScore: 88,
    languages: ["Rust"],
    explanation: "High priority feature for the Tauri ecosystem.",
    stars: 89000
  }
];

const skillOptions = ['JavaScript', 'TypeScript', 'React', 'Python', 'Rust', 'Go', 'Tailwind', 'Node.js', 'AI/ML'];

const labelColors: {[key: string]: string} = {
  'bug': 'bg-red-500',
  'enhancement': 'bg-green-500',
  'documentation': 'bg-blue-500',
  'good first issue': 'bg-purple-500',
  'help wanted': 'bg-amber-500',
  'question': 'bg-sky-500'
};

export default function OpenSourceLaunchpad() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'recommender' | 'generator' | 'dashboard'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  // Analyzer State
  const [issueTitle, setIssueTitle] = useState('');
  const [issueBody, setIssueBody] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzedTitle, setAnalyzedTitle] = useState('');

  // Recommender State
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['JavaScript', 'React']);
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [recommendations, setRecommendations] = useState<RecommendedIssue[]>([]);
  const [hasGeneratedRecs, setHasGeneratedRecs] = useState(false);

  // Generator State
  const [repoUrl, setRepoUrl] = useState('https://github.com/facebook/react');
  const [generatedReadme, setGeneratedReadme] = useState('');
  const [repoName, setRepoName] = useState('');
  const [isEditingReadme, setIsEditingReadme] = useState(false);

  const simulateAnalysis = useCallback((title: string, body: string): AnalysisResult => {
    const text = (title + ' ' + body).toLowerCase();
    
    let classification = 'feature';
    if (text.includes('bug') || text.includes('fix') || text.includes('error') || text.includes('crash')) {
      classification = 'bug';
    } else if (text.includes('doc') || text.includes('readme') || text.includes('guide')) {
      classification = 'docs';
    } else if (text.includes('question') || text.includes('how') || text.includes('?')) {
      classification = 'question';
    } else if (text.includes('spam') || text.includes('advert') || text.length < 20) {
      classification = 'spam';
    }

    const priority = Math.min(95, Math.max(30, 45 + Math.floor(Math.random() * 50) + (text.length > 200 ? 20 : 0)));

    let labels: string[] = [];
    if (classification === 'bug') labels = ['bug', 'needs triage'];
    else if (classification === 'feature') labels = ['enhancement', 'feature'];
    else if (classification === 'docs') labels = ['documentation'];
    else if (classification === 'question') labels = ['question'];
    else labels = ['invalid'];

    if (Math.random() > 0.6) labels.push('good first issue');

    const similarIssues = [
      { title: "Similar bug in rendering engine", repo: "vercel/next.js", similarity: 87 },
      { title: "UI rendering regression", repo: "facebook/react", similarity: 74 },
      { title: "Component state not updating", repo: "mui/material-ui", similarity: 65 },
    ];

    return {
      classification: classification.toUpperCase(),
      priority,
      labels,
      similarIssues,
      explanation: `This issue appears to be related to ${classification}. The description suggests it may impact core functionality.`
    };
  }, []);

  const handleAnalyze = async () => {
    if (!issueTitle.trim()) return;
    
    setIsLoading(true);
    setAnalyzedTitle(issueTitle);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1350));
    
    const result = simulateAnalysis(issueTitle, issueBody);
    setAnalysis(result);
    setIsLoading(false);
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    // Score based on skills match
    const scoredIssues = mockIssues.map(issue => {
      const skillMatch = issue.languages.filter(lang => 
        selectedSkills.some(skill => 
          lang.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(lang.toLowerCase())
        )
      ).length;
      
      const updatedScore = Math.min(98, issue.matchScore + (skillMatch * 8) - (experience === 'beginner' ? 15 : 0));
      
      return {
        ...issue,
        matchScore: Math.floor(updatedScore)
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
    
    setRecommendations(scoredIssues);
    setHasGeneratedRecs(true);
    setIsLoading(false);
  };

  const extractRepoName = (url: string): string => {
    try {
      const parts = url.replace('https://github.com/', '').split('/');
      return parts.length > 1 ? `${parts[0]}/${parts[1]}` : 'unknown/repo';
    } catch {
      return 'unknown/repo';
    }
  };

  const generateReadmeContent = (repo: string): string => {
    const name = repo.split('/')[1] || 'Project';
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    
    return `# ${capitalized}\n\n` +
      `A modern ${name} library built with passion and open source love.\n\n` +
      
      `## ✨ Features\n\n` +
      `- ⚡ Blazing fast performance\n` +
      `- 🎨 Beautiful and responsive UI\n` +
      `- 🔧 Highly configurable\n` +
      `- 📱 Mobile friendly\n\n` +
      
      `## 🚀 Tech Stack\n\n` +
      `- **Frontend:** React, TypeScript, Tailwind CSS\n` +
      `- **Backend:** Node.js / Python (depending on the repo)\n` +
      `- **Other:** Vite, GitHub Actions\n\n` +
      
      `## 📦 Installation\n\n` +
      `\`\`\`bash\n` +
      `git clone https://github.com/${repo}.git\n` +
      `cd ${name}\n` +
      `npm install\n` +
      `\`\`\`\n\n` +
      
      `## 🛠 Usage\n\n` +
      `\`\`\`tsx\n` +
      `import { Component } from '${name}';\n\n` +
      `function App() {\n` +
      `  return <Component magic={true} />;\n` +
      `}\n` +
      `\`\`\`\n\n` +
      
      `## 🤝 Contributing\n\n` +
      `We love contributions! Please check out our [Contributing Guide](CONTRIBUTING.md).\n\n` +
      `1. Fork the repo\n` +
      `2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)\n` +
      `3. Commit your changes (\`git commit -m 'Add amazing feature'\`)\n` +
      `4. Push to the branch (\`git push origin feature/amazing-feature\`)\n` +
      `5. Open a Pull Request\n\n` +
      
      `## 📄 License\n\n` +
      `This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.\n\n` +
      
      `---\n\n` +
      `Made with ❤️ by the open source community.`;
  };

  const handleGenerateReadme = async () => {
    if (!repoUrl.trim()) return;
    
    setIsLoading(true);
    const name = extractRepoName(repoUrl);
    setRepoName(name);
    
    await new Promise(resolve => setTimeout(resolve, 1450));
    
    const content = generateReadmeContent(name);
    setGeneratedReadme(content);
    setIsEditingReadme(false);
    setIsLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast but keep simple
    alert('✅ Copied to clipboard!');
  };

  const resetAnalyzer = () => {
    setIssueTitle('');
    setIssueBody('');
    setAnalysis(null);
    setAnalyzedTitle('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      {/* HEADER */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="max-w-screen-2xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-violet-600 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-2xl tracking-tighter text-white">launchpad<span className="text-violet-400">.</span>ai</div>
              <div className="text-[10px] text-zinc-500 -mt-1">OPEN SOURCE OS</div>
            </div>
          </div>

          <div className="flex items-center gap-x-8 text-sm">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={cn("flex items-center gap-x-2 px-5 py-2 rounded-3xl transition-all", 
                activeTab === 'dashboard' ? 'bg-white text-zinc-900 font-medium' : 'hover:bg-zinc-900')}
            >
              <Star className="w-4 h-4" />
              DASHBOARD
            </button>
            <button 
              onClick={() => setActiveTab('analyzer')}
              className={cn("flex items-center gap-x-2 px-5 py-2 rounded-3xl transition-all", 
                activeTab === 'analyzer' ? 'bg-white text-zinc-900 font-medium' : 'hover:bg-zinc-900')}
            >
              <Search className="w-4 h-4" />
              ANALYZER
            </button>
            <button 
              onClick={() => setActiveTab('recommender')}
              className={cn("flex items-center gap-x-2 px-5 py-2 rounded-3xl transition-all", 
                activeTab === 'recommender' ? 'bg-white text-zinc-900 font-medium' : 'hover:bg-zinc-900')}
            >
              <Users className="w-4 h-4" />
              RECOMMENDER
            </button>
            <button 
              onClick={() => setActiveTab('generator')}
              className={cn("flex items-center gap-x-2 px-5 py-2 rounded-3xl transition-all", 
                activeTab === 'generator' ? 'bg-white text-zinc-900 font-medium' : 'hover:bg-zinc-900')}
            >
              <BookOpen className="w-4 h-4" />
              README AI
            </button>
          </div>

          <div className="flex items-center gap-x-4">
            <div className="flex items-center gap-x-2 bg-zinc-900 px-4 py-1.5 rounded-3xl text-xs border border-zinc-700">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Connected to GitHub</span>
            </div>
            <div className="w-8 h-8 bg-zinc-800 rounded-2xl flex items-center justify-center text-xs font-mono border border-zinc-700">JS</div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto flex">
        {/* SIDEBAR */}
        <div className="w-72 border-r border-zinc-800 bg-zinc-950 h-[calc(100vh-73px)] p-6 hidden lg:flex flex-col">
          <div className="mb-8">
            <div className="uppercase text-xs tracking-[1px] text-zinc-500 mb-3">YOUR WORKSPACE</div>
            <div className="space-y-1">
              {[
                { label: 'Recent Analyses', icon: Clock, count: 12 },
                { label: 'Saved Issues', icon: Star, count: 8 },
                { label: 'My Contributions', icon: ExternalLink, count: 3 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between px-4 py-3 hover:bg-zinc-900 rounded-2xl text-sm cursor-pointer">
                  <div className="flex items-center gap-x-3">
                    <item.icon className="w-4 h-4 text-zinc-400" />
                    <span>{item.label}</span>
                  </div>
                  <div className="text-zinc-500 text-xs bg-zinc-900 px-2 py-px rounded">{item.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="uppercase text-xs tracking-[1px] text-zinc-500 mb-3 mt-6">COMMUNITY INSIGHTS</div>
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-5 text-xs leading-relaxed">
              184 new "good first issues" were posted in the last 24 hours.
              <div className="text-emerald-400 mt-4 text-[10px] flex items-center gap-1">
                <Zap className="w-3 h-3" /> TRENDING: Rust • AI Agents
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8">
            <div className="text-[10px] text-zinc-500">
              Powered by mock embeddings +<br />rule-based classification
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8 overflow-auto" style={{ height: 'calc(100vh - 73px)' }}>
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="max-w-4xl">
                <div className="mb-12">
                  <h1 className="text-6xl font-semibold tracking-tighter text-white mb-3">Welcome to the Launchpad</h1>
                  <p className="text-2xl text-zinc-400">Your AI co-pilot for open source</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div 
                    onClick={() => setActiveTab('analyzer')}
                    className="group bg-zinc-900 border border-zinc-800 hover:border-violet-500 rounded-3xl p-8 cursor-pointer transition-all"
                  >
                    <div className="h-11 w-11 bg-red-500/10 text-red-400 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="text-xl font-semibold mb-2">Issue Analyzer</div>
                    <div className="text-zinc-400 text-[15px]">Classify, prioritize and find duplicates using AI</div>
                    <div className="mt-8 text-xs uppercase tracking-widest text-violet-400 inline-flex items-center gap-2">
                      TRY NOW <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('recommender')}
                    className="group bg-zinc-900 border border-zinc-800 hover:border-emerald-500 rounded-3xl p-8 cursor-pointer transition-all"
                  >
                    <div className="h-11 w-11 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="text-xl font-semibold mb-2">Smart Recommender</div>
                    <div className="text-zinc-400 text-[15px]">Find issues that match your skills and interests</div>
                    <div className="mt-8 text-xs uppercase tracking-widest text-emerald-400 inline-flex items-center gap-2">
                      EXPLORE <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('generator')}
                    className="group bg-zinc-900 border border-zinc-800 hover:border-amber-500 rounded-3xl p-8 cursor-pointer transition-all"
                  >
                    <div className="h-11 w-11 bg-amber-500/10 text-amber-400 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="text-xl font-semibold mb-2">README Generator</div>
                    <div className="text-zinc-400 text-[15px]">Instantly create beautiful documentation</div>
                    <div className="mt-8 text-xs uppercase tracking-widest text-amber-400 inline-flex items-center gap-2">
                      GENERATE <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <div className="mt-16">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-lg font-medium">Featured Open Source Issues</div>
                    <button onClick={() => setActiveTab('recommender')} className="text-xs flex items-center gap-x-2 text-zinc-400 hover:text-white">
                      SEE ALL RECOMMENDATIONS <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {mockIssues.slice(0, 4).map(iss => (
                      <div key={iss.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex gap-5">
                        <div className="flex-1">
                          <div className="font-medium text-sm line-clamp-2">{iss.title}</div>
                          <div className="text-xs text-zinc-500 mt-3 flex items-center gap-2">
                            <ExternalLink className="w-3 h-3" /> {iss.repo}
                          </div>
                        </div>
                        <div>
                          <div className="text-right">
                            <div className="inline-block bg-emerald-400 text-emerald-950 text-[10px] font-mono font-bold px-2.5 py-px rounded">{iss.matchScore}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ISSUE ANALYZER */}
          {activeTab === 'analyzer' && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-zinc-900 rounded-3xl text-xs mb-3">
                  <Zap className="text-violet-400" /> ISSUE TRIAGE ENGINE
                </div>
                <h2 className="text-5xl font-semibold tracking-tighter">Issue Intelligence</h2>
                <p className="text-zinc-400 mt-2">Drop an issue. Get classification, priority and similar matches.</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">ISSUE TITLE</label>
                    <input 
                      type="text" 
                      value={issueTitle}
                      onChange={(e) => setIssueTitle(e.target.value)}
                      className="w-full bg-black border border-zinc-700 focus:border-violet-500 rounded-2xl px-5 py-4 outline-none text-lg placeholder:text-zinc-500"
                      placeholder="Cannot render component after state update..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">DESCRIPTION / BODY</label>
                    <textarea 
                      value={issueBody}
                      onChange={(e) => setIssueBody(e.target.value)}
                      rows={6}
                      className="w-full bg-black border border-zinc-700 focus:border-violet-500 rounded-3xl px-5 py-4 outline-none font-light resize-y"
                      placeholder="When clicking the submit button the form does not submit and instead throws the error: ..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={handleAnalyze}
                      disabled={isLoading || !issueTitle.trim()}
                      className="flex-1 bg-white hover:bg-zinc-100 active:bg-white transition-colors disabled:bg-zinc-700 text-zinc-900 font-semibold py-4 rounded-2xl flex items-center justify-center gap-x-2 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>Analyzing with AI <RefreshCw className="w-4 h-4 animate-spin" /></>
                      ) : (
                        <>ANALYZE ISSUE <Sparkles className="w-4 h-4" /></>
                      )}
                    </button>
                    
                    <button onClick={resetAnalyzer} className="px-8 border border-zinc-700 hover:bg-zinc-900 rounded-2xl text-sm">RESET</button>
                  </div>
                </div>
              </div>

              {analysis && (
                <div className="mt-8 bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden">
                  <div className="px-8 pt-8 pb-6 border-b border-zinc-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="uppercase text-xs text-zinc-400 mb-1">ANALYZED</div>
                        <div className="text-xl font-medium text-white line-clamp-2">{analyzedTitle}</div>
                      </div>
                      <div className={`px-5 py-1 text-sm font-mono rounded-3xl ${analysis.classification === 'BUG' ? 'bg-red-500/10 text-red-400' : analysis.classification === 'FEATURE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {analysis.classification}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 grid grid-cols-2 gap-8">
                    {/* Priority */}
                    <div>
                      <div className="flex justify-between text-xs mb-3">
                        <div className="text-zinc-400">PRIORITY SCORE</div>
                        <div className="font-mono text-xl font-semibold text-white">{analysis.priority}</div>
                      </div>
                      <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-all" 
                          style={{ width: `${analysis.priority}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1">Higher is more urgent</div>
                    </div>

                    {/* Labels */}
                    <div>
                      <div className="text-xs text-zinc-400 mb-3">SUGGESTED LABELS</div>
                      <div className="flex flex-wrap gap-2">
                        {analysis.labels.map((label, i) => (
                          <div key={i} className={cn(
                            "text-xs px-4 py-1 rounded-3xl font-medium",
                            labelColors[label] || 'bg-zinc-700 text-white'
                          )}>
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-8 pb-8">
                    <div className="text-xs text-zinc-400 mb-4">POSSIBLE DUPLICATES • SIMILARITY</div>
                    <div className="space-y-4">
                      {analysis.similarIssues.map((similar, index) => (
                        <div key={index} className="flex items-center justify-between bg-black rounded-2xl px-5 py-4">
                          <div className="flex items-center gap-x-4">
                            <div className="text-emerald-400">
                              <ExternalLink className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm">{similar.title}</div>
                              <div className="text-xs text-zinc-500">{similar.repo}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-xs text-emerald-400">{similar.similarity}% match</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black/60 px-8 py-6 text-xs border-t border-zinc-800 flex items-center justify-between">
                    <div>{analysis.explanation}</div>
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(analysis, null, 2))}
                      className="flex items-center gap-x-2 text-zinc-400 hover:text-white"
                    >
                      <Copy className="w-3 h-3" /> JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RECOMMENDER */}
          {activeTab === 'recommender' && (
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <div className="inline px-4 py-1 text-xs bg-teal-500/10 text-teal-400 rounded-3xl">MATCH ENGINE</div>
                  <h1 className="text-5xl tracking-tighter font-semibold mt-3">Find Your Next Contribution</h1>
                </div>
                <div className="text-zinc-400 max-w-[260px] text-sm">Our ranking algorithm combines your skills with issue metadata, labels and popularity.</div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                {/* Filters */}
                <div className="col-span-12 lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-7 h-fit">
                  <div className="uppercase text-xs font-medium tracking-widest mb-6 text-zinc-400">YOUR PROFILE</div>
                  
                  <div className="mb-8">
                    <div className="text-sm mb-3 text-white">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map(skill => (
                        <div 
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={cn(
                            "cursor-pointer text-xs border px-4 py-2 rounded-3xl transition-all",
                            selectedSkills.includes(skill) 
                              ? "bg-white text-black border-white" 
                              : "border-zinc-700 hover:bg-zinc-800"
                          )}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm mb-3 text-white">Experience Level</div>
                    <div className="flex bg-zinc-950 border border-zinc-700 rounded-3xl p-1">
                      {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                        <button
                          key={level}
                          onClick={() => setExperience(level)}
                          className={cn(
                            "flex-1 py-3 text-xs rounded-[14px] transition-all",
                            experience === level 
                              ? 'bg-white text-black shadow' 
                              : ''
                          )}
                        >
                          {level.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleGetRecommendations} 
                    disabled={isLoading}
                    className="w-full mt-10 bg-white text-black py-4 rounded-2xl text-sm font-semibold active:scale-[0.985] flex items-center justify-center gap-x-2 disabled:opacity-70"
                  >
                    {isLoading ? 'RANKING ISSUES...' : 'FIND MATCHING ISSUES'}
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>

                {/* Results */}
                <div className="col-span-12 lg:col-span-8">
                  {!hasGeneratedRecs ? (
                    <div className="h-[380px] flex items-center justify-center border border-dashed border-zinc-700 rounded-3xl">
                      <div className="text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
                          <Users className="w-8 h-8 text-zinc-400" />
                        </div>
                        <div className="text-zinc-400">Your personalized issue recommendations will appear here.</div>
                        <div className="text-xs text-zinc-500 mt-3">Select skills and hit the button above</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recommendations.map((issue) => (
                        <div key={issue.id} className="bg-zinc-900 border border-zinc-700 rounded-3xl p-7 flex gap-6 group">
                          <div className="flex-1">
                            <div className="flex items-center gap-x-3">
                              <div className="font-semibold text-base">{issue.title}</div>
                            </div>
                            <a href={issue.url} target="_blank" className="text-xs text-zinc-400 hover:text-violet-300 flex items-center gap-x-1 mt-1">
                              {issue.repo} <span className="text-[9px]">↗</span>
                            </a>

                            <div className="flex gap-2 mt-6">
                              {issue.labels.map(lab => (
                                <span key={lab} className="text-[10px] bg-zinc-800 text-zinc-400 px-3 py-px rounded-full">{lab}</span>
                              ))}
                            </div>
                          </div>

                          <div className="w-40 flex-shrink-0 text-right flex flex-col items-end justify-between">
                            <div>
                              <div className="text-xs text-zinc-400">MATCH</div>
                              <div className="text-5xl font-semibold text-emerald-300 tabular-nums">{issue.matchScore}</div>
                            </div>

                            <div className="text-right">
                              <div className="text-xs opacity-60">{issue.difficulty}</div>
                              <div className="flex gap-px mt-4">
                                {issue.languages.map(l => (
                                  <div key={l} className="text-[10px] bg-zinc-800 px-2 py-px rounded">{l}</div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="w-px bg-zinc-800 self-stretch" />

                          <div className="text-xs max-w-[190px] text-zinc-400 leading-tight pt-1">
                            {issue.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* README GENERATOR */}
          {activeTab === 'generator' && (
            <div className="max-w-[1100px] mx-auto">
              <div className="mb-8">
                <h2 className="text-5xl font-semibold tracking-tighter mb-1">README Generator</h2>
                <p className="text-zinc-400">Turn any GitHub repo into documentation in seconds</p>
              </div>

              <div className="flex gap-6">
                {/* Input */}
                <div className="w-96 flex-shrink-0">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                    <label className="text-xs tracking-[0.5px] text-zinc-400 block mb-2">REPOSITORY URL</label>
                    <input 
                      value={repoUrl} 
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="block w-full rounded-2xl bg-zinc-950 border border-zinc-700 px-5 py-4 text-sm font-mono focus:outline-none focus:border-amber-400"
                      placeholder="https://github.com/user/repo"
                    />
                    
                    <button 
                      onClick={handleGenerateReadme}
                      disabled={isLoading || !repoUrl}
                      className="mt-6 w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-semibold rounded-2xl flex items-center justify-center gap-x-2 shadow-inner active:scale-95 disabled:opacity-60"
                    >
                      {isLoading ? "GENERATING..." : "GENERATE README"}
                      <Sparkles className="w-4 h-4" />
                    </button>

                    {repoName && (
                      <div className="mt-6 text-xs flex items-center gap-x-2 text-zinc-400">
                        <div className="px-3 py-1 bg-zinc-800 rounded">📦 {repoName}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <div className="flex-1">
                  {generatedReadme ? (
                    <div className="border border-zinc-700 bg-zinc-900 rounded-3xl overflow-hidden">
                      <div className="bg-black px-8 py-4 border-b border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-x-3">
                          <BookOpen className="text-amber-400" />
                          <span className="font-medium text-sm">PREVIEW</span>
                        </div>
                        <div className="flex items-center gap-x-4 text-xs">
                          <button 
                            onClick={() => setIsEditingReadme(!isEditingReadme)}
                            className="flex items-center gap-x-1.5 hover:text-white text-zinc-400"
                          >
                            {isEditingReadme ? 'PREVIEW' : 'EDIT'}
                          </button>
                          <button onClick={() => copyToClipboard(generatedReadme)} className="flex items-center gap-x-1 text-zinc-400 hover:text-white">
                            <Copy className="w-3.5 h-3.5" /> COPY MD
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-9 max-h-[620px] overflow-auto bg-[#0a0a0a] text-sm prose prose-invert">
                        {isEditingReadme ? (
                          <textarea 
                            value={generatedReadme} 
                            onChange={(e) => setGeneratedReadme(e.target.value)}
                            className="w-full h-[520px] font-mono text-xs bg-transparent outline-none resize-none text-zinc-300"
                          />
                        ) : (
                          <div className="prose prose-invert prose-headings:text-white prose-strong:text-amber-300 max-w-none">
                            <ReactMarkdown>
                              {generatedReadme}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-zinc-700 bg-zinc-900/60 h-[460px] rounded-3xl flex items-center justify-center">
                      <div className="-mt-6 text-center">
                        <div className="mx-auto mb-6 rounded-2xl bg-zinc-800 w-20 h-20 flex items-center justify-center">
                          <BookOpen className="w-9 h-9 text-zinc-400" />
                        </div>
                        <p className="text-zinc-400 max-w-[210px]">Enter a GitHub repo link and our AI will generate a complete README.md for you</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER BAR */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-zinc-900 border-t border-zinc-800 flex items-center px-8 text-xs z-50 text-zinc-400">
        <div>Demo for hackathon. All data mocked. Built in React + TypeScript.</div>
        <div className="ml-auto flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <div className="w-px h-3 bg-zinc-700" /> 
            SIMULATED EMBEDDINGS
          </div>
          <div>HYBRID CLASSIFIER</div>
          <div>SCORE v0.8</div>
        </div>
      </div>
    </div>
  );
}
