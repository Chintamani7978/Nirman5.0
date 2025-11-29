create or replace function get_ministry_dashboard_stats()
returns json as $$
declare
  stats json;
begin
  select json_build_object(
    'total_problems', (select count(*) from problems),
    'problems_by_status', (select json_agg(t) from (select status, count(*) as count from problems group by status) t),
    'problems_by_category', (select json_agg(t) from (select category, count(*) as count from problems group by category) t),
    'top_category', (select category from problems group by category order by count(*) desc limit 1)
  ) into stats;
  
  return stats;
end;
$$ language plpgsql;
