import $ from "dax";
import "https://deno.land/std@0.205.0/dotenv/load.ts";

const apiKey = Deno.env.get("X-MICROCMS-API-KEY") ?? "";

// run a command
await $`echo Start`; // outputs: 5

const res = await fetch("https://keystone.microcms.io/api/v1/blog", {
  headers: {
    "X-MICROCMS-API-KEY": apiKey,
  },
});

const json = await res.json();

const totalCount = json.totalCount;

const count = Math.floor(totalCount / 10) + 1;

for (let i = 0; i < count; i++) {
  const res = await fetch(
    `https://keystone.microcms.io/api/v1/blog?offset=${i * 10}`,
    {
      headers: {
        "X-MICROCMS-API-KEY": apiKey,
      },
    },
  );

  const json = await res.json();
  const contents = json.contents;

  for (const content of contents) {
    const id = content.id;
    const text = content.text;

    const patchRes = await fetch(
      `https://keystone.microcms.io/api/v1/blog/${id}`,
      {
        method: "PATCH",
        headers: {
          "X-MICROCMS-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text }),
      },
    );

    $.log(patchRes.statusText);
    await $`sleep 1`;
  }
}
