const migrateBindings = ({
  dataset,
  bindings,
  pushToLocalStorage,
  getSheetId
}) => {
  const datasetFiles = dataset.files.map((entry) => entry.name);
  bindings.forEach(async (binding) => {
    const fileName = binding.id.replace('dw::', '');
    const worksheetId = await getSheetId(binding.rangeAddress);

    if (datasetFiles.includes(fileName)) {
      pushToLocalStorage(
        { owner: dataset.owner, id: dataset.id },
        fileName,
        binding.rangeAddress,
        worksheetId,
        new Date()
      );
    }
  });
};

export default [migrateBindings];
