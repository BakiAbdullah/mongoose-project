import { FilterQuery, Query } from 'mongoose'

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>
  public query: Record<string, unknown>

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery
    this.query = query
  }

  // Search method using OOP
  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      })
    }
    return this
  }

  // Filter method using OOP
  filter() {
    const queryObj = { ...this.query } // copy of query object

    // Filtering
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields']

    excludeFields.forEach((el) => delete queryObj[el])

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>)

    return this
  }

  // Sort method using OOP
  sort() {
    const sort = (this?.query.sort as string)?.split(',')?.join(' ') || '-createdAt'
    this.modelQuery = this.modelQuery.sort(sort as string)

    return this
  }

  // Pagination method using OOP
  paginate() {
    const page = Number(this?.query?.page) || 1
    const limit = Number(this?.query?.limit) || 1
    const skip = (page - 1) * limit

    this.modelQuery = this.modelQuery.skip(skip).limit(limit)
    return this
  }

  // Field filtering using OOP
  fields() {
    // { fields: 'name,email' }
    // { fields: 'name email' }
    const fields =
      (this?.query.fields as string)?.split(',')?.join(' ') || '-__V'
    this.modelQuery = this.modelQuery.select(fields)

    return this
  }
}

export default QueryBuilder
