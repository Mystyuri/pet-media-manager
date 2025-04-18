import { FileManager } from '@/components/FileManager';
import Guard from '@/app/guard';

export default function Home() {
  return (
    <Guard>
      <FileManager />
    </Guard>
  );
}
