interface Prop {
  name: string;
  type: string;
  default?: string;
  description: string;
}

interface PropsTableProps {
  props: Prop[];
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">
              Prop
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">
              Type
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">
              Default
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b">
              <td className="py-3 px-4">
                <code className="text-blue-600">{prop.name}</code>
              </td>
              <td className="py-3 px-4">
                <code className="text-purple-600 text-xs">{prop.type}</code>
              </td>
              <td className="py-3 px-4">
                {prop.default ? (
                  <code className="text-green-600 text-xs">{prop.default}</code>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="py-3 px-4 text-gray-700">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
