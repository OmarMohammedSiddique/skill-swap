'use client'

import { useState } from 'react'
import { deleteSkillByName, mergeSkills } from './actions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Code, AlertTriangle, XCircle, CheckCircle, ArrowRight } from 'lucide-react'

export default function SkillsClient({ skills }: { skills: string[] }) {
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
    const [mergeTarget, setMergeTarget] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    const handleDelete = async (skillName: string) => {
        if (!confirm(`Are you sure you want to delete ALL instances of "${skillName}"? This cannot be undone.`)) return
        setIsProcessing(true)
        try {
            await deleteSkillByName(skillName)
        } catch (e) {
            alert('Failed to delete')
        }
        setIsProcessing(false)
    }

    const handleMerge = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedSkill || !mergeTarget) return

        if (!confirm(`Merge "${selectedSkill}" into "${mergeTarget}"?`)) return
        
        setIsProcessing(true)
        try {
            await mergeSkills(mergeTarget, selectedSkill)
            setSelectedSkill(null)
            setMergeTarget('')
        } catch (e) {
            alert('Failed to merge')
        }
        setIsProcessing(false)
    }

    return (
        <div className="space-y-6">
            {/* Merge UI Overlay or Inline */}
            {selectedSkill && (
                <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900 mb-6 sticky top-4 z-10 shadow-lg animate-in slide-in-from-top-2">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-500">
                             <AlertTriangle size={20} />
                             <h3 className="font-semibold">Merging Skill: {selectedSkill}</h3>
                        </div>
                        <p className="text-sm text-yellow-700 dark:text-yellow-600">All users with this skill will be updated to the new name.</p>
                        <form onSubmit={handleMerge} className="flex gap-2">
                            <Input 
                                type="text" 
                                placeholder="New Skill Name (e.g. React)" 
                                className="bg-white dark:bg-slate-900 border-yellow-300 dark:border-yellow-800"
                                value={mergeTarget}
                                onChange={(e) => setMergeTarget(e.target.value)}
                                autoFocus
                            />
                            <Button 
                                type="submit" 
                                disabled={isProcessing}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white dark:text-slate-900"
                            >
                                <CheckCircle size={16} className="mr-2"/>
                                Confirm Merge
                            </Button>
                            <Button 
                                type="button" 
                                variant="ghost"
                                onClick={() => setSelectedSkill(null)}
                                className="text-yellow-800 dark:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                            >
                                Cancel
                            </Button>
                        </form>
                    </div>
                </Card>
            )}

            <div className="grid gap-4">
                {skills.map((skill) => (
                    <Card key={skill} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-4 hover:shadow-md transition-shadow bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <div className="flex gap-4">
                            <div className="p-2 rounded-full h-fit bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                <Code size={20} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-semibold text-slate-900 dark:text-white text-lg">{skill}</h4>
                                    <Badge variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-normal">
                                        Skill Tag
                                    </Badge>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Listed in database</p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                             <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDelete(skill)}
                                className="flex-1 md:flex-none text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/50"
                             >
                                <XCircle size={16} className="mr-2" /> 
                                Delete
                            </Button>
                             <Button 
                                size="sm" 
                                onClick={() => setSelectedSkill(skill)}
                                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700"
                             >
                                <ArrowRight size={16} className="mr-2" />
                                Merge
                            </Button>
                        </div>
                    </Card>
                ))}
                 {skills.length === 0 && (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        No unique skills found in database.
                    </div>
                )}
            </div>
        </div>
    )
}
