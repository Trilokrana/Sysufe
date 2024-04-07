const CategoryPage = ({ match }) => {
  const categoryName = match.params.categoryName;

  return (
    <div>
      <h2>{categoryName} Category Page</h2>
      {/* Render category content based on the category name */}
    </div>
  );
};

export default CategoryPage;
