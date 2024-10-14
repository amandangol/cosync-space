'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageCover from '@/assets/ImageCover'
import { DialogClose } from '@radix-ui/react-dialog'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

function CoverModal({ children, setNewCover }) {
  const [selectedCover, setSelectedCover] = useState(null)
  const [customImage, setCustomImage] = useState(null)

  const handleFileChange = event => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCustomImage(reader.result)
        setSelectedCover(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSelectCover = coverUrl => {
    setSelectedCover(coverUrl)
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Cover</DialogTitle>
          <DialogDescription>
            <div className="mt-3 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {ImageCover.map((cover, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectCover(cover?.imageUrl)}
                  className={`${
                    selectedCover === cover?.imageUrl &&
                    'border-2 border-primary'
                  } cursor-pointer rounded-md p-1`}
                >
                  <Image
                    src={cover?.imageUrl}
                    width={200}
                    height={140}
                    className="h-[70px] w-full rounded-md object-cover"
                  />
                </div>
              ))}
              {customImage && (
                <div
                  onClick={() => handleSelectCover(customImage)}
                  className={`${
                    selectedCover === customImage && 'border-2 border-primary'
                  } cursor-pointer rounded-md p-1`}
                >
                  <Image
                    src={customImage}
                    width={200}
                    height={140}
                    className="h-[70px] w-full rounded-md object-cover"
                  />
                </div>
              )}
            </div>
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="customFileUpload"
              />

              <label
                htmlFor="customFileUpload"
                className="mt-1 inline-block cursor-pointer rounded-md bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
              >
                Upload Custom Cover
              </label>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={() => setNewCover(selectedCover)}>
              Update
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CoverModal