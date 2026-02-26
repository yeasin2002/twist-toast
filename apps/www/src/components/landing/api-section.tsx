import { SectionHeader, TableCard } from "../blocks/primitives";
import {
  callOptions,
  createOptions,
  methods,
  type ApiOptionRow,
  type MethodRow,
} from "./data";

interface OptionsTableProps {
  caption: string;
  rows: ApiOptionRow[];
  showDefault?: boolean;
}

function OptionsTable({ caption, rows, showDefault }: OptionsTableProps) {
  return (
    <table className="tt-table mt-4">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          <th>Option</th>
          <th>Type</th>
          {showDefault ? <th>Default</th> : null}
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.option}>
            <td>{row.option}</td>
            <td>{row.type}</td>
            {showDefault ? <td>{row.defaultValue}</td> : null}
            <td>{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MethodsTable({ rows }: { rows: MethodRow[] }) {
  return (
    <table className="tt-table mt-4">
      <caption className="sr-only">Toast runtime methods</caption>
      <thead>
        <tr>
          <th>Method</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.method}>
            <td>{row.method}</td>
            <td>{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ApiSection() {
  return (
    <section id="api" className="container">
      <SectionHeader
        title="API reference"
        subtitle="Core options designed for predictable runtime control"
      />

      <div className="space-y-6">
        <TableCard title="createToast options">
          <OptionsTable
            caption="Create toast options"
            rows={createOptions}
            showDefault
          />
        </TableCard>

        <TableCard title="Per-toast call options">
          <OptionsTable caption="Per toast options" rows={callOptions} />
        </TableCard>

        <TableCard title="Runtime methods">
          <MethodsTable rows={methods} />
        </TableCard>
      </div>
    </section>
  );
}
