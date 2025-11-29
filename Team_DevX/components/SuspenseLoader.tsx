import { Spinner } from "@/components/ui/spinner";

const SuspenseLoader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full absolute inset-0">
      <Spinner size="large" />
    </div>
  );
};

export default SuspenseLoader;
