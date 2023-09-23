import * as elements from "typed-html";
import { Puppy } from "../db/schema";
import NewPuppyForm from "./NewPuppyForm";
import PuppyItem from "./PuppyItem";

export default function PuppyList({ puppies }: { puppies: Puppy[] }) {
  return (
    <div>
      <NewPuppyForm />
    </div>
  );
}
