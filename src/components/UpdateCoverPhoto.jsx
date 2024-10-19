import { useState } from 'react';
import Image from 'next/image';
import ImageCover from '@/assets/CoverImages'; 
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function UpdateCoverPhoto({ children, setNewCover }) {
  const [selectedCover, setSelectedCover] = useState(null);
  const [customImage, setCustomImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result);
        setSelectedCover(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectCover = (coverUrl) => {
    setSelectedCover(coverUrl);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Update Cover</DialogTitle>
          <DialogDescription>Select a cover image from below or upload a custom one.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          {ImageCover.map((cover, index) => (
            <div
              key={index}
              onClick={() => handleSelectCover(cover.imageUrl)}
              className={`${
                selectedCover === cover.imageUrl ? 'border-2 border-blue-600' : ''
              } cursor-pointer rounded-md p-1 bg-gray-700`}
            >
              <Image
                src={cover.imageUrl}
                alt={`Cover ${index + 1}`}
                width={100}
                height={100}
                className="rounded-md"
                quality={100} 
              />
            </div>
          ))}
          {customImage && (
            <div
              onClick={() => handleSelectCover(customImage)}
              className={`${
                selectedCover === customImage ? 'border-2 border-blue-600' : ''
              } cursor-pointer rounded-md p-1 bg-gray-700`}
            >
              <Image
                src={customImage}
                alt="Custom Cover"
                width={100}
                height={100}
                className="rounded-md"
                quality={100} // Set quality if needed
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
            id="cover-upload"
          />
          <label
            htmlFor="cover-upload"
            className="cursor-pointer bg-gray-700 text-white hover:bg-gray-600 px-4 py-2 rounded-md inline-block"
          >
            Upload Custom Cover
          </label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600">
              Close
            </Button>
          </DialogClose>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setNewCover(selectedCover)}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateCoverPhoto;
