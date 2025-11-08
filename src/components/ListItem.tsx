import { GoldIcon, IncomeBreakDown } from "../pages/style";

export const ListItem = ({
  title,
  value,
  isTotal,
}: {
  title: string;
  value: string | number;
  isTotal?: boolean | undefined;
}) => {
  if (isTotal)
    return (
      <IncomeBreakDown.NoListItem>
        <IncomeBreakDown.ListContainer>
          <b>{title} :</b>
          <IncomeBreakDown.Value>
            {value}
            <GoldIcon />
          </IncomeBreakDown.Value>
        </IncomeBreakDown.ListContainer>
      </IncomeBreakDown.NoListItem>
    );

  return (
    <IncomeBreakDown.ListItem>
      <IncomeBreakDown.ListContainer>
        {title} :
        <IncomeBreakDown.Value>
          {value}
          <GoldIcon />
        </IncomeBreakDown.Value>
      </IncomeBreakDown.ListContainer>
    </IncomeBreakDown.ListItem>
  );
};
