import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { assessmentData } from '@/data/assessmentQuestions';
import { getStudents, saveStudents } from '@/utils/seedData';

interface AssessmentProps {
  navigate: (page: string) => void;
}

type Phase = 'select' | 'quiz' | 'result';

export function Assessment({ navigate }: AssessmentProps) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') {
      navigate('login');
    }
  }, [currentUser]);

  const currentSkillData = assessmentData.find(d => d.skill === selectedSkill);

  const handleStartQuiz = () => {
    if (!selectedSkill) return;
    setAnswers({});
    setPhase('quiz');
  };

  const handleAnswer = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (!currentSkillData) return;
    const allAnswered = currentSkillData.questions.every(q => answers[q.id] !== undefined);
    if (!allAnswered) {
      showToast('Please answer all questions before submitting.', 'warning');
      return;
    }

    let correct = 0;
    currentSkillData.questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    setScore(correct);

    // Save to student profile
    if (currentUser) {
      const students = getStudents();
      const today = new Date().toISOString().split('T')[0];
      const updated = students.map(s => {
        if (s.id !== currentUser.id) return s;
        const existingIdx = s.assessments.findIndex(a => a.testName === selectedSkill);
        const newAssessment = { testName: selectedSkill, score: correct, date: today };
        if (existingIdx >= 0) {
          const updatedAssessments = [...s.assessments];
          updatedAssessments[existingIdx] = newAssessment;
          return { ...s, assessments: updatedAssessments };
        }
        return { ...s, assessments: [...s.assessments, newAssessment] };
      });
      saveStudents(updated);
    }

    setPhase('result');
  };

  const handleRetake = () => {
    setPhase('select');
    setSelectedSkill('');
    setAnswers({});
    setScore(0);
  };

  const getScoreColor = (s: number) => {
    if (s >= 4) return 'text-emerald-600';
    if (s >= 3) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreMessage = (s: number) => {
    if (s === 5) return 'Perfect Score! Outstanding!';
    if (s >= 4) return 'Excellent! Great job!';
    if (s >= 3) return 'Good effort! Keep practicing.';
    return 'Keep learning and try again!';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Skill Assessment</h1>
          <p className="text-slate-500 text-sm mt-1">Test your knowledge and earn verified badges</p>
        </div>

        {/* Select Phase */}
        {phase === 'select' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-2">Choose a Skill to Test</h2>
            <p className="text-slate-500 text-sm mb-6">Each test has 5 multiple-choice questions. Results are saved to your profile.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {assessmentData.map(skill => (
                <button
                  key={skill.skill}
                  onClick={() => setSelectedSkill(skill.skill)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${selectedSkill === skill.skill ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                >
                  <div className={`w-8 h-8 rounded-lg mb-2 flex items-center justify-center ${selectedSkill === skill.skill ? 'gradient-primary' : 'bg-slate-100'}`}>
                    <BookOpen className={`w-4 h-4 ${selectedSkill === skill.skill ? 'text-white' : 'text-slate-500'}`} />
                  </div>
                  <p className={`font-semibold text-sm ${selectedSkill === skill.skill ? 'text-blue-700' : 'text-slate-900'}`}>{skill.skill}</p>
                  <p className="text-xs text-slate-500 mt-0.5">5 questions</p>
                </button>
              ))}
            </div>
            <Button
              onClick={handleStartQuiz}
              disabled={!selectedSkill}
              className="w-full gradient-primary text-white border-0 hover:opacity-90"
            >
              Start Assessment
            </Button>
          </div>
        )}

        {/* Quiz Phase */}
        {phase === 'quiz' && currentSkillData && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold text-slate-900">{currentSkillData.skill} Assessment</h2>
              <span className="text-sm text-slate-500">
                {Object.keys(answers).length}/{currentSkillData.questions.length} answered
              </span>
            </div>

            <div className="space-y-6">
              {currentSkillData.questions.map((q, qi) => (
                <div key={q.id} className="border border-slate-200 rounded-xl p-4">
                  <p className="font-medium text-slate-900 mb-3">
                    <span className="text-blue-600 font-bold mr-2">Q{qi + 1}.</span>
                    {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option, oi) => (
                      <button
                        key={oi}
                        onClick={() => handleAnswer(q.id, oi)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${answers[q.id] === oi ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50'}`}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setPhase('select')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 gradient-primary text-white border-0 hover:opacity-90"
              >
                Submit Assessment
              </Button>
            </div>
          </div>
        )}

        {/* Result Phase */}
        {phase === 'result' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-50 border-4 border-slate-200 flex items-center justify-center mx-auto mb-4">
              <Trophy className={`w-10 h-10 ${getScoreColor(score)}`} />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Assessment Complete!</h2>
            <p className="text-slate-500 text-sm mb-6">{selectedSkill} Assessment</p>

            <div className={`text-6xl font-bold font-display mb-2 ${getScoreColor(score)}`}>
              {score}/5
            </div>
            <p className={`text-lg font-semibold mb-2 ${getScoreColor(score)}`}>{getScoreMessage(score)}</p>
            <p className="text-slate-500 text-sm mb-6">
              Result saved to your profile on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            {/* Answer review */}
            {currentSkillData && (
              <div className="text-left space-y-3 mb-6">
                <h3 className="font-semibold text-slate-900 text-sm">Answer Review:</h3>
                {currentSkillData.questions.map((q, qi) => {
                  const isCorrect = answers[q.id] === q.correctIndex;
                  return (
                    <div key={q.id} className={`p-3 rounded-lg border text-sm ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-start gap-2">
                        {isCorrect
                          ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          : <span className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-0.5 flex items-center justify-center text-white text-xs font-bold">✗</span>
                        }
                        <div>
                          <p className="font-medium text-slate-900">Q{qi + 1}: {q.question}</p>
                          {!isCorrect && (
                            <p className="text-emerald-700 text-xs mt-1">Correct: {q.options[q.correctIndex]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRetake} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Take Another Test
              </Button>
              <Button onClick={() => navigate('student-dashboard')} className="flex-1 gradient-primary text-white border-0">
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
