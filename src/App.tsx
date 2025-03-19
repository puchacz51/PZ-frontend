import { Button } from './components/ui/button';

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="space-y-4">
        <Button variant={"default"} size="lg" onClick={() => window.open("https://ui.shadcn.com/docs", "_blank")} className='cursor-pointer'>
          Shadn Doc
        </Button>
      </div>

      <div className="mt-8 p-4 bg-white rounded-md shadow-md">
        <p className="text-blue-500 font-semibold">
          Tailwind CSS TEST:
        </p>
        <ul className="list-disc pl-5 mt-2">
          <li className="text-green-600">`bg-white` - białe tło</li>
          <li className="text-purple-600">`rounded-md` - zaokrąglone rogi</li>
          <li className="text-orange-600">`shadow-md` - średni cień</li>
          <li className="text-teal-600">`p-4` - padding (wewnętrzny margines)</li>
        </ul>
      </div>
    </div>
  );
}

export default App;