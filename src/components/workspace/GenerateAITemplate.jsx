"use client";
import { Button } from '@/components/ui/button'
import { LayoutGrid, Loader2Icon } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { chatSession } from '@/config/GoogleAIModel';

function GenerateAITemplate({ setGenerateAIOutput }) {
    const [open, setOpen] = useState(false)
    const [userInput, setUserInput] = useState('')
    const [loading, setLoading] = useState(false)

    const GenerateForm = async () => {
        setLoading(true)
        const PROMPT = 'Generate Template for editor.js in JSON for ' + userInput
        const result = await chatSession.sendMessage(PROMPT)
        console.log(result.response.text())
        try {
            const output = JSON.parse(result.response.text())
            setGenerateAIOutput(output)
        } catch (error) {
            setLoading(false)
        }
        setLoading(false)
        setOpen(false)
    }

    return (
        <div>
            <Button 
                variant="outline" 
                className="flex gap-2 bg-gray-800 text-white hover:bg-gray-700 hover:text-white" 
                onClick={() => setOpen(true)}
            >
                <LayoutGrid className='h-4 w-4' />
                Generate AI Template
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-gray-900 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Generate AI Template</DialogTitle>
                        <DialogDescription>
                            <h2 className='mt-5 text-gray-300'>What do you want to write in the document?</h2>
                            <Input 
                                placeholder="Ex. Project Idea" 
                                onChange={(e) => setUserInput(e?.target.value)}
                                className="mt-2 bg-gray-800 border-gray-700 text-white"
                            />
                            <div className='mt-5 flex gap-5 justify-end'>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setOpen(false)}
                                    className="text-gray-300 hover:bg-gray-800 hover:text-gray-300 "
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="default" 
                                    disabled={!userInput || loading}
                                    onClick={() => GenerateForm()}
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    {loading ? <Loader2Icon className='animate-spin' /> : 'Generate'}
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default GenerateAITemplate