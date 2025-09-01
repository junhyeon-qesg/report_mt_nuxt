<script setup lang="ts">
import { jspreadsheet } from '@jspreadsheet/vue';
import parser from '@jspreadsheet/parser';
import '@jspreadsheet/bar/dist/style.css';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet/dist/jspreadsheet.css';
// Define the grid license
jspreadsheet.setLicense('MDJmOThiNDI5Njg3MGY2ZGUwYWJhNDkxMGMxZmE2MWNiMzBiNTE1YjZiNGJjNWEwZjgyZDFkZTEwMjc1MGE0ODQ1NDg3ZmMyZGNlMzU5OGQxNjVlNzY5MTc0YTlhYzgzNzdjNjI4ODU4M2ZmMWI1YWVhOWI3MTg3Yjk2OTNhNWIsZXlKamJHbGxiblJKWkNJNklpSXNJbTVoYldVaU9pSktjM0J5WldGa2MyaGxaWFFpTENKa1lYUmxJam94TnpVMk5URXpOamN4TENKa2IyMWhhVzRpT2xzaWFuTndjbVZoWkhOb1pXVjBMbU52YlNJc0ltTnZaR1Z6WVc1a1ltOTRMbWx2SWl3aWFuTm9aV3hzTG01bGRDSXNJbU56WWk1aGNIQWlMQ0p6ZEdGamEySnNhWFI2TG1sdklpd2lkMlZpWTI5dWRHRnBibVZ5TG1sdklpd2lkMlZpSWl3aWJHOWpZV3hvYjNOMElsMHNJbkJzWVc0aU9pSXpOQ0lzSW5OamIzQmxJanBiSW5ZM0lpd2lkamdpTENKMk9TSXNJbll4TUNJc0luWXhNU0lzSW1Ob1lYSjBjeUlzSW1admNtMXpJaXdpWm05eWJYVnNZU0lzSW5CaGNuTmxjaUlzSW5KbGJtUmxjaUlzSW1OdmJXMWxiblJ6SWl3aWFXMXdiM0owWlhJaUxDSmlZWElpTENKMllXeHBaR0YwYVc5dWN5SXNJbk5sWVhKamFDSXNJbkJ5YVc1MElpd2ljMmhsWlhSeklpd2lZMnhwWlc1MElpd2ljMlZ5ZG1WeUlpd2ljMmhoY0dWeklpd2labTl5YldGMElsMHNJbVJsYlc4aU9uUnlkV1Y5');

// Define the grid extensions
jspreadsheet.setExtensions({ parser });

const spreadSheet = ref(null);

const afterChanges = (worksheet) => {
  // Get the updated data from the worksheet
  const data = worksheet.getData();
  // Do something when the user changes the data
};

onMounted(async () => {
  const result = await $fetch('/sample.xlsx', {
    method: 'get',
    responseType: 'blob',
  }) as Blob;
  console.log(spreadSheet.value);

  const blob = new Blob([result], { type: result.type });

  console.log(blob);

  jspreadsheet.parser({
    file: blob,
    onload: function (config) {
      // You can intercept the configuration and add JavaScript events
      config.afterChanges = afterChanges;
      // Create the spreadsheet

      console.log(config);
      jspreadsheet(spreadSheet.value, config);
    },
  });
});
</script>

<template>
  <div ref="spreadSheet" />
</template>
