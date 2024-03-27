import { Table } from 'flowbite-react';
import { DefaultValues } from './InputForm';

const GeometryTable = ({
  layoutValues,
  wheelbase,
}: {
  layoutValues: DefaultValues;
  wheelbase: number;
}) => {
  const stack = Math.round(
    layoutValues.bbDrop +
      (layoutValues.forkLength + layoutValues.headTubeLength) *
        Math.sin((layoutValues.headTubeAngle * Math.PI) / 180)
  );

  return (
    <Table striped>
      <Table.Head>
        <Table.HeadCell>Property</Table.HeadCell>
        <Table.HeadCell>Value</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Wheelbase</Table.Cell>
          <Table.Cell>{Math.round(wheelbase)}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Stack Height</Table.Cell>
          <Table.Cell>{stack}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Reach</Table.Cell>
          <Table.Cell>{layoutValues.reach}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Head Tube Angle</Table.Cell>
          <Table.Cell>{layoutValues.headTubeAngle}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Seat Tube Angle</Table.Cell>
          <Table.Cell>{layoutValues.seatTubeAngle}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Chainstay Length</Table.Cell>
          <Table.Cell>{layoutValues.chainStay}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Shock Travel</Table.Cell>
          <Table.Cell>
            {layoutValues.shockMax - layoutValues.shockMin}
          </Table.Cell>
        </Table.Row>
        {/* {Object.entries(layoutValues).map(([property, value]) => (
          <Table.Row key={property}>
            <Table.Cell>{property}</Table.Cell>
            <Table.Cell>{value}</Table.Cell>
          </Table.Row>
        ))} */}
      </Table.Body>
    </Table>
  );
};

export default GeometryTable;
