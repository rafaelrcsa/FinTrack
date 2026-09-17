namespace FinTrack.Domain.Entities;

/// <summary>
/// Shared by domain entities that repeat monthly on the day of <see cref="StartDate"/>,
/// optionally stopping after <see cref="EndDate"/> (inclusive). A null <see cref="EndDate"/>
/// means the recurrence is ongoing indefinitely.
/// </summary>
public interface IRecurring
{
    DateOnly StartDate { get; set; }
    DateOnly? EndDate { get; set; }

    bool IsActiveInMonth(int year, int month)
    {
        var monthStart = new DateOnly(year, month, 1);
        var startMonth = new DateOnly(StartDate.Year, StartDate.Month, 1);
        if (monthStart < startMonth)
        {
            return false;
        }

        if (EndDate is { } end)
        {
            var endMonth = new DateOnly(end.Year, end.Month, 1);
            if (monthStart > endMonth)
            {
                return false;
            }
        }

        return true;
    }
}
