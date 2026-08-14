import { useMemo, useState } from "react";
import { ToggleButton } from "@heroui/react/toggle-button";
import type { ProductVariant } from "~/data/products";
import { getCompatibleOptions } from "~/data/products";

type OptionKey = "type" | "alternator" | "phase";

const labels: Record<OptionKey, string> = {
  type: "Generator type",
  alternator: "Alternator",
  phase: "Phase",
};

function findVariant(
  variants: readonly ProductVariant[],
  selection: Pick<ProductVariant, OptionKey>,
) {
  return variants.find(
    (variant) =>
      variant.type === selection.type &&
      variant.alternator === selection.alternator &&
      variant.phase === selection.phase,
  );
}

export function ProductConfigurator({ variants }: { variants: readonly ProductVariant[] }) {
  const firstVariant = variants[0];
  if (!firstVariant) {
    return (
      <p className="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950" role="status">
        Configuration details are currently unavailable. Please contact us for specifications.
      </p>
    );
  }

  return <ProductConfiguratorContent firstVariant={firstVariant} variants={variants} />;
}

function ProductConfiguratorContent({
  firstVariant,
  variants,
}: {
  firstVariant: ProductVariant;
  variants: readonly ProductVariant[];
}) {
  const [selection, setSelection] = useState<Pick<ProductVariant, OptionKey>>(() => ({
    type: firstVariant.type,
    alternator: firstVariant.alternator,
    phase: firstVariant.phase,
  }));
  const activeVariant = findVariant(variants, selection) ?? firstVariant;

  const options = useMemo(
    () => ({
      type: [...new Set(variants.map((variant) => variant.type))],
      alternator: [...new Set(variants.map((variant) => variant.alternator))],
      phase: [...new Set(variants.map((variant) => variant.phase))],
    }),
    [variants],
  );

  function select(key: OptionKey, value: string) {
    const next = { ...selection, [key]: value };
    if (findVariant(variants, next)) {
      setSelection(next);
      return;
    }

    const closest = variants.find((variant) =>
      Object.entries(next).every(([candidateKey, selected]) => {
        return candidateKey === key || variant[candidateKey as OptionKey] === selected;
      }),
    );

    setSelection(
      closest
        ? { type: closest.type, alternator: closest.alternator, phase: closest.phase, [key]: value }
        : { type: firstVariant.type, alternator: firstVariant.alternator, phase: firstVariant.phase },
    );
  }

  return (
    <div className="mt-8">
      <div className="space-y-6">
        {(Object.keys(options) as OptionKey[]).map((key) => {
          const compatible = getCompatibleOptions(variants, selection, key);
          return (
            <fieldset key={key}>
              <legend className="text-sm font-bold text-slate-800">{labels[key]}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {options[key].map((option) => {
                  const selected = selection[key] === option;
                  const available = compatible.includes(option);
                  return (
                    <ToggleButton
                      className={`min-h-11 rounded-md border-2 px-4 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        selected
                          ? "border-teal-900 bg-teal-900 text-white"
                          : "border-slate-300 bg-white text-slate-800 hover:border-teal-800"
                      } disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400`}
                      isDisabled={!available}
                      isSelected={selected}
                      key={option}
                      onPress={() => select(key, option)}
                      variant="ghost"
                    >
                      {option}
                    </ToggleButton>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      <section aria-live="polite" aria-labelledby="specifications-heading" className="mt-10 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-black text-slate-950" id="specifications-heading">
          Specifications
        </h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Specifications for the selected generator configuration</caption>
            <tbody>
              {Object.entries(activeVariant.specifications).map(([name, value]) => (
                <tr className="border-b border-slate-200 last:border-0" key={name}>
                  <th className="w-2/5 bg-slate-50 px-4 py-3 font-bold text-slate-800" scope="row">
                    {name}
                  </th>
                  <td className="px-4 py-3 text-slate-700">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
