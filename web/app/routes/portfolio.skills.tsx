import { Search } from "lucide-react";
import { useMemo } from "react";
import { Flipped, Flipper } from "react-flip-toolkit";
import { Form, useLoaderData, useSubmit } from "react-router";
import { SkillCard } from "~/features/skills/components/SkillCard";
import { allTags, skills } from "~/features/skills/contents/contents";
import type { Route } from "./+types/portfolio.skills";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const tag = url.searchParams.get("tag")?.trim() || null;
  const keywords = url.searchParams.get("keywords")?.trim() || null;

  return { tag, keywords };
}

export default function SkillsPage() {
  const { tag, keywords } = useLoaderData<typeof loader>();

  const tagFilteredSkills = useMemo(
    () => (tag ? skills.filter((skill) => skill.tags.includes(tag)) : skills),
    [tag]
  );

  const filteredSkills = useMemo(
    () =>
      keywords
        ? tagFilteredSkills.filter(
            (skill) =>
              skill.name.toLowerCase().includes(keywords.toLowerCase()) ||
              skill.description
                ?.toLowerCase()
                .includes(keywords.toLowerCase()) ||
              skill.tags.some((t) =>
                t.toLowerCase().includes(keywords.toLowerCase())
              )
          )
        : tagFilteredSkills,
    [keywords, tagFilteredSkills]
  );

  const submit = useSubmit();

  return (
    <div className="space-y-8">
      <h1 className="font-extrabold text-3xl">Skills</h1>
      <Form role="search" id="search-form" className="flex flex-wrap gap-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">検索</legend>
          <label className="input input-sm">
            <Search className="h-4 w-4 text-base-content/50" />
            <input
              type="search"
              name="keywords"
              placeholder="検索"
              className="grow"
              defaultValue={keywords ?? ""}
              onChange={(event) => {
                const formData = new FormData(
                  event.currentTarget.form ?? undefined
                );
                const value = event.currentTarget.value.trim();

                // 空でない場合のみkeywordsを追加
                if (!value) {
                  formData.delete("keywords");
                }

                // tag="on"を削除
                const tagValue = formData.get("tag");
                if (tagValue === "none") {
                  formData.delete("tag");
                }

                const isFirstSearch = keywords === null;
                submit(formData, { replace: !isFirstSearch });
              }}
            />
          </label>
        </fieldset>
        <fieldset className="fieldset flex-1">
          <legend className="fieldset-legend">タグで絞り込み</legend>
          <div className="flex-nowrap overflow-x-scroll filter">
            <input
              type="radio"
              className="btn btn-sm filter-reset"
              name="tag"
              aria-label="All"
              value="none"
              defaultChecked={tag === null}
              onChange={() => {
                const formData = new FormData(
                  document.getElementById("search-form") as HTMLFormElement
                );
                formData.delete("tag");

                // 空のkeywordsを削除
                const keywordsValue = formData.get("keywords");
                if (!keywordsValue || keywordsValue === "") {
                  formData.delete("keywords");
                }

                submit(formData, { replace: true });
              }}
            />
            {allTags.map((t) => (
              <input
                key={t}
                type="radio"
                className="btn btn-sm"
                name="tag"
                value={t}
                aria-label={t}
                onChange={(event) => {
                  const formData = new FormData(
                    event.currentTarget.form ?? undefined
                  );

                  // 空のkeywordsを削除
                  const keywordsValue = formData.get("keywords");
                  if (!keywordsValue || keywordsValue === "") {
                    formData.delete("keywords");
                  }

                  const isFirstSearch = tag === null;
                  submit(formData, { replace: !isFirstSearch });
                }}
                defaultChecked={t === tag}
              />
            ))}
          </div>
        </fieldset>
      </Form>
      <Flipper flipKey={filteredSkills.map((skill) => skill.name).join(",")}>
        <div className="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(22em,1fr))]">
          {filteredSkills.map((skill) => (
            <Flipped key={skill.name} flipId={skill.name}>
              {(flippedProps) => (
                <SkillCard
                  name={skill.name}
                  tags={skill.tags}
                  proficiency={skill.proficiency}
                  description={skill.description}
                  Icon={skill.Icon}
                  {...flippedProps}
                />
              )}
            </Flipped>
          ))}
        </div>
      </Flipper>
    </div>
  );
}
