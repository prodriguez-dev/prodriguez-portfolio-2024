import { SliceZone } from "@prismicio/react";
import {
  SliceSimulator,
  SliceSimulatorParams,
  getSlices,
} from "@slicemachine/adapter-next/simulator";

import { components } from "../../slices";

export default async function SliceSimulatorPage({
  searchParams,
}: SliceSimulatorParams) {
  const resolvedSearchParams = await searchParams;
  const slices = getSlices(resolvedSearchParams.state);

  return (
    <SliceSimulator background="#022c22">
      <SliceZone slices={slices} components={components} />
    </SliceSimulator>
  );
}
