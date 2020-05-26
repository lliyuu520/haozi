package com.lliyuu520.root.modular.consumer.repository;/**
 * @author lliyuu520
 * @since 2020/8/1814:49
 */

import com.lliyuu520.root.modular.integral.entity.Integral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.io.Serializable;

/**
 * SysUserRepository
 *
 * @author lliyuu520
 * @Since 2020/8/18
 */
@Repository
public interface IntegralRepository extends JpaRepository<Integral, Serializable>, JpaSpecificationExecutor<Integral> {


}
