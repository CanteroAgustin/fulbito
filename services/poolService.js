import * as poolRepository from '../repository/poolRepository';

export function getPool() {
  poolRepository.getPool();
}

export function editPool(pool) {
  poolRepository.editPool(pool);
}